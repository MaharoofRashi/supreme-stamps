import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const phone = searchParams.get("phone");

    if (!id || !phone) {
        return NextResponse.json({ success: false, message: "Order ID and Phone Number are required" }, { status: 400 });
    }

    try {
        const order = await prisma.order.findUnique({
            where: { friendlyId: id },
            select: {
                friendlyId: true,
                status: true,
                createdAt: true,
                deliveryMethod: true,
                customerPhone: true, // Select phone to compare
            }
        });

        if (!order) {
            return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 });
        }

        // Validate Phone Number (Basic check, can be improved with parsing)
        // We remove spaces and special chars to match loosely
        const normalize = (p: string) => p.replace(/[^0-9+]/g, "");
        if (normalize(order.customerPhone) !== normalize(phone)) {
            return NextResponse.json({ success: false, message: "Phone number does not match order records." }, { status: 401 });
        }

        // Return order without sensitive info (remove phone before sending back if paranoid, but it matched so user knows it)
        const { customerPhone, ...safeOrder } = order;

        return NextResponse.json({ success: true, order: safeOrder });

        if (!order) {
            return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, order });

    } catch (error) {
        console.error("Tracking error:", error);
        return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
    }
}
