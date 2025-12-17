import { NextRequest, NextResponse } from "next/server";
import { authenticator } from "otplib";
import { SignJWT } from "jose";

export async function POST(req: NextRequest) {
    try {
        const { code } = await req.json();

        if (!code || code.length !== 6) {
            return NextResponse.json({ success: false, message: "Invalid code format" }, { status: 400 });
        }

        const secret = process.env.ADMIN_TOTP_SECRET;
        if (!secret) {
            console.error("ADMIN_TOTP_SECRET not set");
            return NextResponse.json({ success: false, message: "Server misconfiguration" }, { status: 500 });
        }

        // Verify TOTP
        const isValid = authenticator.check(code, secret);

        if (!isValid) {
            return NextResponse.json({ success: false, message: "Invalid Authenticator Code" }, { status: 401 });
        }

        // Issue JWT
        const jwtSecret = new TextEncoder().encode(process.env.JWT_SECRET);
        const token = await new SignJWT({ role: "admin" })
            .setProtectedHeader({ alg: "HS256" })
            .setIssuedAt()
            .setExpirationTime("24h")
            .sign(jwtSecret);

        const response = NextResponse.json({ success: true });

        // Set HTTP-only cookie
        response.cookies.set("admin_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
            maxAge: 60 * 60 * 24, // 24 hours
        });

        return response;

    } catch (error) {
        console.error("Login Check Failed:", error);
        return NextResponse.json({ success: false, message: "Internal Error" }, { status: 500 });
    }
}
