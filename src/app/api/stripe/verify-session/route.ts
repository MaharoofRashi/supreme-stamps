import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get('session_id');

    if (!sessionId) {
        return NextResponse.json(
            { success: false, message: 'Session ID is required' },
            { status: 400 }
        );
    }

    try {
        // Retrieve the session from Stripe
        const session = await stripe.checkout.sessions.retrieve(sessionId);

        if (session.payment_status !== 'paid') {
            return NextResponse.json(
                { success: false, message: 'Payment not completed' },
                { status: 400 }
            );
        }

        const orderId = session.metadata?.orderId;

        if (!orderId) {
            return NextResponse.json(
                { success: false, message: 'Order ID not found in session' },
                { status: 400 }
            );
        }

        // Fetch order details
        const order = await prisma.order.findUnique({
            where: { id: orderId },
            select: {
                id: true,
                friendlyId: true,
                status: true,
                paymentStatus: true,
            },
        });

        if (!order) {
            return NextResponse.json(
                { success: false, message: 'Order not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            orderId: order.id,
            friendlyId: order.friendlyId,
            status: order.status,
            paymentStatus: order.paymentStatus,
        });
    } catch (error) {
        console.error('Session verification failed:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to verify session' },
            { status: 500 }
        );
    }
}
