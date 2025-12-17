import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { customAlphabet } from "nanoid";

const alphabet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const generateFriendlyId = customAlphabet(alphabet, 6);

// Validation schema for a single item
const orderItemSchema = z.object({
    shape: z.string(),
    color: z.string(),
    companyName: z.string().nullable().optional(),
    companyNameAr: z.string().nullable().optional(),
    licenseNumber: z.string().nullable().optional(),
    emirate: z.string().nullable().optional(),
    hasLogo: z.boolean(),
    basePrice: z.number().optional(),
    logoPrice: z.number().optional(),
    tradeLicenseUrl: z.string().nullable().optional(),
    price: z.number(),
});

// Validation schema for the full order payload
const orderPayloadSchema = z.object({
    customerName: z.string().min(1, "Name is required"),
    customerEmail: z.string().email("Invalid email").optional().or(z.literal("")),
    customerPhone: z.string().min(5, "Phone is required"),
    deliveryMethod: z.enum(["DELIVERY", "PICKUP"]),
    address: z.string().optional(),
    items: z.array(orderItemSchema).min(1, "Cart is empty"),
    totalPrice: z.number(),
});

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        // Validate
        const validatedData = orderPayloadSchema.parse(body);

        // Generate Friendly ID
        const friendlyId = `SS-${generateFriendlyId()}`;

        // Save to DB (Transactional)
        // We create the Order and all OrderItems in one go
        const order = await prisma.order.create({
            data: {
                friendlyId,
                customerName: validatedData.customerName,
                customerEmail: validatedData.customerEmail || null,
                customerPhone: validatedData.customerPhone,
                deliveryMethod: validatedData.deliveryMethod,
                address: validatedData.address || null,
                totalPrice: validatedData.totalPrice,
                status: "PENDING",
                items: {
                    create: validatedData.items.map(item => ({
                        shape: item.shape,
                        color: item.color,
                        companyName: item.companyName || null,
                        companyNameAr: item.companyNameAr || null,
                        licenseNumber: item.licenseNumber || null,
                        emirate: item.emirate || null,
                        hasLogo: item.hasLogo,
                        tradeLicenseUrl: item.tradeLicenseUrl || null,
                        price: item.price
                    }))
                }
            },
        });

        return NextResponse.json({ success: true, orderId: order.friendlyId });

    } catch (error) {
        console.error("Order creation failed:", error);
        if (error instanceof z.ZodError) {
            return NextResponse.json({ success: false, errors: error.flatten().fieldErrors }, { status: 400 });
        }
        return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
    }
}
