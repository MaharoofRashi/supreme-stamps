import { NextRequest, NextResponse } from 'next/server';
import { stripe, STRIPE_CONFIG } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { orderId } = body;

        if (!orderId) {
            return NextResponse.json(
                { success: false, message: 'Order ID is required' },
                { status: 400 }
            );
        }

        // Fetch the order from database
        const order = await prisma.order.findUnique({
            where: { id: orderId },
            include: { items: true },
        });

        if (!order) {
            return NextResponse.json(
                { success: false, message: 'Order not found' },
                { status: 404 }
            );
        }

        // Create line items for Stripe
        const lineItems = order.items.map((item) => ({
            price_data: {
                currency: STRIPE_CONFIG.currency,
                product_data: {
                    name: `${item.shape} Stamp${item.hasLogo ? ' with Custom Logo' : ''}`,
                    description: item.companyName || 'Custom Company Stamp',
                    metadata: {
                        color: item.color,
                        shape: item.shape,
                    },
                },
                unit_amount: Math.round(item.price * 100), // Convert to fils (smallest currency unit)
            },
            quantity: 1,
        }));

        // Create Stripe Checkout Session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            success_url: `${STRIPE_CONFIG.successUrl}?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: STRIPE_CONFIG.cancelUrl,
            customer_email: order.customerEmail || undefined,
            client_reference_id: order.id,
            metadata: {
                orderId: order.id,
                friendlyId: order.friendlyId || '',
            },
            payment_intent_data: {
                metadata: {
                    orderId: order.id,
                    friendlyId: order.friendlyId || '',
                },
            },
        });

        // Update order with payment session ID
        await prisma.order.update({
            where: { id: orderId },
            data: {
                paymentId: session.id,
                paymentStatus: 'pending',
            },
        });

        return NextResponse.json({
            success: true,
            sessionId: session.id,
            url: session.url,
        });
    } catch (error) {
        console.error('Stripe checkout session creation failed:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to create checkout session' },
            { status: 500 }
        );
    }
}
