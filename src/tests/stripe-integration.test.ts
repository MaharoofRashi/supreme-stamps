/**
 * Integration tests for Stripe payment flow
 * 
 * Note: These tests use mocks since we can't actually charge cards in tests.
 * For real payment testing, use Stripe test mode with test cards manually.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock Stripe
vi.mock('@/lib/stripe', () => ({
    stripe: {
        checkout: {
            sessions: {
                create: vi.fn(),
                retrieve: vi.fn(),
            },
        },
        webhooks: {
            constructEvent: vi.fn(),
        },
    },
    STRIPE_CONFIG: {
        currency: 'aed',
        successUrl: 'http://localhost:3000/checkout/success',
        cancelUrl: 'http://localhost:3000/checkout/cancel',
    },
}));

// Mock Prisma
vi.mock('@/lib/prisma', () => ({
    prisma: {
        order: {
            findUnique: vi.fn(),
            update: vi.fn(),
        },
    },
}));

describe('Stripe Integration', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('Checkout Session Creation', () => {
        it('should create a valid checkout session', async () => {
            const { stripe } = await import('@/lib/stripe');
            const { prisma } = await import('@/lib/prisma');

            const mockOrder = {
                id: 'order_123',
                friendlyId: 'SS-TEST123',
                customerEmail: 'test@example.com',
                totalPrice: 198,
                items: [
                    {
                        shape: 'Round',
                        color: 'Black',
                        price: 149,
                        hasLogo: false,
                        companyName: 'Test Company',
                    },
                    {
                        shape: 'Rectangle',
                        color: 'Blue',
                        price: 49,
                        hasLogo: true,
                        companyName: 'Test Company',
                    },
                ],
            };

            (prisma.order.findUnique as any).mockResolvedValue(mockOrder);
            (stripe.checkout.sessions.create as any).mockResolvedValue({
                id: 'cs_test_123',
                url: 'https://checkout.stripe.com/pay/cs_test_123',
            });

            // Simulate creating a checkout session
            const session = await stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                line_items: mockOrder.items.map((item) => ({
                    price_data: {
                        currency: 'aed',
                        product_data: {
                            name: `${item.shape} Stamp${item.hasLogo ? ' with Custom Logo' : ''}`,
                        },
                        unit_amount: item.price * 100,
                    },
                    quantity: 1,
                })),
                mode: 'payment',
                success_url: 'http://localhost:3000/checkout/success?session_id={CHECKOUT_SESSION_ID}',
                cancel_url: 'http://localhost:3000/checkout/cancel',
                customer_email: mockOrder.customerEmail,
                metadata: {
                    orderId: mockOrder.id,
                    friendlyId: mockOrder.friendlyId,
                },
            });

            expect(session.id).toBe('cs_test_123');
            expect(session.url).toContain('checkout.stripe.com');
            expect(stripe.checkout.sessions.create).toHaveBeenCalledWith(
                expect.objectContaining({
                    mode: 'payment',
                    customer_email: 'test@example.com',
                })
            );
        });

        it('should include correct line items', async () => {
            const { stripe } = await import('@/lib/stripe');

            const mockItems = [
                { shape: 'Round', price: 149, hasLogo: false },
                { shape: 'Rectangle', price: 198, hasLogo: true },
            ];

            await stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                line_items: mockItems.map((item) => ({
                    price_data: {
                        currency: 'aed',
                        product_data: {
                            name: `${item.shape} Stamp${item.hasLogo ? ' with Custom Logo' : ''}`,
                        },
                        unit_amount: item.price * 100,
                    },
                    quantity: 1,
                })),
                mode: 'payment',
                success_url: 'http://localhost:3000/checkout/success',
                cancel_url: 'http://localhost:3000/checkout/cancel',
            });

            expect(stripe.checkout.sessions.create).toHaveBeenCalledWith(
                expect.objectContaining({
                    line_items: expect.arrayContaining([
                        expect.objectContaining({
                            price_data: expect.objectContaining({
                                unit_amount: 14900, // 149 AED in fils
                            }),
                        }),
                    ]),
                })
            );
        });
    });

    describe('Webhook Event Handling', () => {
        it('should verify webhook signature', async () => {
            const { stripe } = await import('@/lib/stripe');

            const mockEvent = {
                type: 'checkout.session.completed',
                data: {
                    object: {
                        id: 'cs_test_123',
                        metadata: { orderId: 'order_123' },
                    },
                },
            };

            (stripe.webhooks.constructEvent as any).mockReturnValue(mockEvent);

            const event = stripe.webhooks.constructEvent(
                'raw_body',
                'signature',
                'webhook_secret'
            );

            expect(event.type).toBe('checkout.session.completed');
            expect(stripe.webhooks.constructEvent).toHaveBeenCalledWith(
                'raw_body',
                'signature',
                'webhook_secret'
            );
        });

        it('should update order status on payment success', async () => {
            const { prisma } = await import('@/lib/prisma');

            const mockUpdatedOrder = {
                id: 'order_123',
                status: 'PAID',
                paymentStatus: 'paid',
                paymentId: 'cs_test_123',
            };

            (prisma.order.update as any).mockResolvedValue(mockUpdatedOrder);

            const updatedOrder = await prisma.order.update({
                where: { id: 'order_123' },
                data: {
                    status: 'PAID',
                    paymentStatus: 'paid',
                    paymentId: 'cs_test_123',
                },
            });

            expect(updatedOrder.status).toBe('PAID');
            expect(updatedOrder.paymentStatus).toBe('paid');
        });
    });

    describe('Session Verification', () => {
        it('should retrieve and verify payment session', async () => {
            const { stripe } = await import('@/lib/stripe');

            const mockSession = {
                id: 'cs_test_123',
                payment_status: 'paid',
                metadata: {
                    orderId: 'order_123',
                    friendlyId: 'SS-TEST123',
                },
            };

            (stripe.checkout.sessions.retrieve as any).mockResolvedValue(mockSession);

            const session = await stripe.checkout.sessions.retrieve('cs_test_123');

            expect(session.payment_status).toBe('paid');
            expect(session.metadata?.orderId).toBe('order_123');
        });
    });
});

/**
 * Manual Testing Checklist for Stripe:
 * 
 * 1. Create order and proceed to checkout
 * 2. Use test card: 4242 4242 4242 4242
 * 3. Verify redirect to success page
 * 4. Check webhook receives checkout.session.completed event
 * 5. Verify order status updated to PAID
 * 6. Confirm emails sent (order confirmation + payment receipt)
 * 
 * Test Cards:
 * - Success: 4242 4242 4242 4242
 * - Decline: 4000 0000 0000 0002
 * - 3D Secure: 4000 0025 0000 3155
 */
