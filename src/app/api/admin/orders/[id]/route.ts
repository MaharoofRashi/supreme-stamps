import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

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
        });

        return NextResponse.json({ success: true, order });

    } catch (error) {
        console.error("Order update failed:", error);
        return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
    }
}
