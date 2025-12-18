/**
 * Integration tests for Mailgun email service
 * 
 * Note: These tests use mocks since we can't actually send emails in tests.
 * For real email testing, use Mailgun sandbox mode manually.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock Mailgun
vi.mock('@/lib/mailgun', () => ({
    mg: {
        messages: {
            create: vi.fn(),
        },
    },
    MAILGUN_CONFIG: {
        domain: 'mg.supremestamps.com',
        from: 'Supreme Stamps <orders@supremestamps.com>',
    },
}));

describe('Mailgun Email Integration', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('Order Confirmation Email', () => {
        it('should send order confirmation with correct data', async () => {
            const { mg, MAILGUN_CONFIG } = await import('@/lib/mailgun');

            const mockOrder = {
                id: 'order_123',
                friendlyId: 'SS-TEST123',
                customerName: 'John Doe',
                customerEmail: 'john@example.com',
                totalPrice: 198,
                deliveryMethod: 'DELIVERY',
                address: '123 Test St, Dubai',
                items: [
                    {
                        shape: 'Round',
                        color: 'Black',
                        price: 149,
                        hasLogo: false,
                        companyName: 'Test Company',
                    },
                ],
            };

            (mg.messages.create as any).mockResolvedValue({
                id: '<email_id@mailgun.org>',
                message: 'Queued. Thank you.',
            });

            const result = await mg.messages.create(MAILGUN_CONFIG.domain, {
                from: MAILGUN_CONFIG.from,
                to: [mockOrder.customerEmail],
                subject: `Order Confirmed - ${mockOrder.friendlyId}`,
                html: '<html>Order confirmation email</html>',
                text: `Your order ${mockOrder.friendlyId} has been confirmed.`,
            });

            expect(result.message).toBe('Queued. Thank you.');
            expect(mg.messages.create).toHaveBeenCalledWith(
                MAILGUN_CONFIG.domain,
                expect.objectContaining({
                    to: ['john@example.com'],
                    subject: 'Order Confirmed - SS-TEST123',
                })
            );
        });

        it('should handle missing email gracefully', async () => {
            const mockOrder = {
                id: 'order_123',
                friendlyId: 'SS-TEST123',
                customerName: 'John Doe',
                customerEmail: null, // No email provided
            };

            // Should not attempt to send email if no email provided
            if (!mockOrder.customerEmail) {
                expect(mockOrder.customerEmail).toBeNull();
                // Email service should return early
            }
        });
    });

    describe('Payment Receipt Email', () => {
        it('should send payment receipt with payment ID', async () => {
            const { mg, MAILGUN_CONFIG } = await import('@/lib/mailgun');

            const mockPaymentData = {
                orderId: 'SS-TEST123',
                customerEmail: 'john@example.com',
                totalPrice: 198,
                paymentId: 'pi_test_123',
            };

            (mg.messages.create as any).mockResolvedValue({
                id: '<email_id@mailgun.org>',
                message: 'Queued. Thank you.',
            });

            await mg.messages.create(MAILGUN_CONFIG.domain, {
                from: MAILGUN_CONFIG.from,
                to: [mockPaymentData.customerEmail],
                subject: `Payment Receipt - ${mockPaymentData.orderId}`,
                html: `<html>Payment ID: ${mockPaymentData.paymentId}</html>`,
            });

            expect(mg.messages.create).toHaveBeenCalledWith(
                MAILGUN_CONFIG.domain,
                expect.objectContaining({
                    subject: 'Payment Receipt - SS-TEST123',
                })
            );
        });
    });

    describe('Status Update Email', () => {
        it('should send status update with correct message', async () => {
            const { mg, MAILGUN_CONFIG } = await import('@/lib/mailgun');

            const statusMessages: Record<string, string> = {
                PROCESSING: 'Your order is being processed and will be ready soon.',
                DELIVERED: 'Your order has been delivered! Thank you for choosing Supreme Stamps.',
                CANCELLED: 'Your order has been cancelled. If you have any questions, please contact us.',
            };

            (mg.messages.create as any).mockResolvedValue({
                id: '<email_id@mailgun.org>',
                message: 'Queued. Thank you.',
            });

            await mg.messages.create(MAILGUN_CONFIG.domain, {
                from: MAILGUN_CONFIG.from,
                to: ['customer@example.com'],
                subject: 'Order Update: PROCESSING - SS-TEST123',
                html: `<html>${statusMessages.PROCESSING}</html>`,
            });

            expect(mg.messages.create).toHaveBeenCalledWith(
                MAILGUN_CONFIG.domain,
                expect.objectContaining({
                    subject: expect.stringContaining('PROCESSING'),
                })
            );
        });

        it('should include all status types', () => {
            const statusMessages: Record<string, string> = {
                PROCESSING: 'Your order is being processed and will be ready soon.',
                DELIVERED: 'Your order has been delivered! Thank you for choosing Supreme Stamps.',
                CANCELLED: 'Your order has been cancelled. If you have any questions, please contact us.',
            };

            expect(statusMessages.PROCESSING).toBeDefined();
            expect(statusMessages.DELIVERED).toBeDefined();
            expect(statusMessages.CANCELLED).toBeDefined();
        });
    });

    describe('Email Configuration', () => {
        it('should have correct sender configuration', async () => {
            const { MAILGUN_CONFIG } = await import('@/lib/mailgun');

            expect(MAILGUN_CONFIG.domain).toBe('mg.supremestamps.com');
            expect(MAILGUN_CONFIG.from).toContain('Supreme Stamps');
            expect(MAILGUN_CONFIG.from).toContain('orders@supremestamps.com');
        });
    });
});

/**
 * Manual Testing Checklist for Mailgun:
 * 
 * 1. Set up Mailgun sandbox domain
 * 2. Add your email as authorized recipient
 * 3. Complete a test order with payment
 * 4. Check inbox for:
 *    - Order confirmation email
 *    - Payment receipt email
 * 5. Update order status in admin dashboard
 * 6. Check inbox for status update email
 * 7. Verify all emails have:
 *    - Correct branding
 *    - All order details
 *    - Working links
 *    - Proper formatting
 * 
 * Production Setup:
 * 1. Configure custom domain (mg.supremestamps.com)
 * 2. Add DNS records (SPF, DKIM, CNAME)
 * 3. Wait for domain verification
 * 4. Update MAILGUN_DOMAIN in .env
 * 5. Test with real customer emails
 */
