import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { sendOrderStatusUpdate } from "@/lib/email-service";

export async function PATCH(req: NextRequest, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    try {
        const body = await req.json();
        const { status } = body;

        if (!status) {
            return NextResponse.json({ success: false, message: "Status required" }, { status: 400 });
        }

        const order = await prisma.order.update({
            where: { id: params.id },
            data: { status },
            include: { items: true },
        });

        // Send status update email if customer has email
        if (order.customerEmail) {
            const statusMessages: Record<string, string> = {
                PROCESSING: "Your order is being processed and will be ready soon.",
                DELIVERED: "Your order has been delivered! Thank you for choosing Supreme Stamps.",
                CANCELLED: "Your order has been cancelled. If you have any questions, please contact us.",
            };

            const message = statusMessages[status] || `Your order status has been updated to ${status}.`;

            try {
                await sendOrderStatusUpdate(order, status, message);
            } catch (emailError) {
                console.error("Failed to send status update email:", emailError);
                // Don't fail the request if email fails
            }
        }

        return NextResponse.json({ success: true, order });

    } catch (error) {
        console.error("Order update failed:", error);
        return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
    }
}
