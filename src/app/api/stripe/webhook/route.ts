import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import { sendOrderConfirmation, sendPaymentReceipt } from '@/lib/email-service';
import Stripe from 'stripe';

export async function POST(req: NextRequest) {
    const body = await req.text();
    const signature = req.headers.get('stripe-signature');

    if (!signature) {
        return NextResponse.json(
            { success: false, message: 'No signature provided' },
            { status: 400 }
        );
    }

    if (!process.env.STRIPE_WEBHOOK_SECRET) {
        console.error('STRIPE_WEBHOOK_SECRET is not configured');
        return NextResponse.json(
            { success: false, message: 'Webhook secret not configured' },
            { status: 500 }
        );
    }

    let event: Stripe.Event;

    try {
        // Verify webhook signature
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (error) {
        console.error('Webhook signature verification failed:', error);
        return NextResponse.json(
            { success: false, message: 'Invalid signature' },
            { status: 400 }
        );
    }

    // Handle the event
    try {
        switch (event.type) {
            case 'checkout.session.completed': {
                const session = event.data.object as Stripe.Checkout.Session;
                await handleCheckoutSessionCompleted(session);
                break;
            }

            case 'checkout.session.expired': {
                const session = event.data.object as Stripe.Checkout.Session;
                await handleCheckoutSessionExpired(session);
                break;
            }

            case 'payment_intent.payment_failed': {
                const paymentIntent = event.data.object as Stripe.PaymentIntent;
                await handlePaymentFailed(paymentIntent);
                break;
            }

            default:
                console.log(`Unhandled event type: ${event.type}`);
        }

        return NextResponse.json({ success: true, received: true });
    } catch (error) {
        console.error('Webhook handler error:', error);
        return NextResponse.json(
            { success: false, message: 'Webhook handler failed' },
            { status: 500 }
        );
    }
}

/**
 * Handle successful checkout session
 */
async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
    const orderId = session.metadata?.orderId;

    if (!orderId) {
        console.error('No orderId in session metadata');
        return;
    }

    console.log('Payment successful for order:', orderId);

    // Update order status
    const order = await prisma.order.update({
        where: { id: orderId },
        data: {
            status: 'PAID',
            paymentStatus: 'paid',
            paymentId: session.id,
        },
        include: { items: true },
    });

    // Send confirmation emails
    try {
        await sendOrderConfirmation(order);
        await sendPaymentReceipt(order, session.id);
    } catch (emailError) {
        console.error('Failed to send confirmation emails:', emailError);
        // Don't fail the webhook if email fails
    }
}

/**
 * Handle expired checkout session
 */
async function handleCheckoutSessionExpired(session: Stripe.Checkout.Session) {
    const orderId = session.metadata?.orderId;

    if (!orderId) {
        console.error('No orderId in session metadata');
        return;
    }

    console.log('Checkout session expired for order:', orderId);

    // Update order status
    await prisma.order.update({
        where: { id: orderId },
        data: {
            paymentStatus: 'expired',
        },
    });
}

/**
 * Handle failed payment
 */
async function handlePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
    const orderId = paymentIntent.metadata?.orderId;

    if (!orderId) {
        console.error('No orderId in payment intent metadata');
        return;
    }

    console.log('Payment failed for order:', orderId);

    // Update order status
    await prisma.order.update({
        where: { id: orderId },
        data: {
            paymentStatus: 'failed',
        },
    });
}
