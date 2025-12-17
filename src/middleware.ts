import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // Only protect /admin routes
    if (pathname.startsWith("/admin")) {
        // Allow access to login page
        if (pathname === "/admin/login") {
            // If already logged in, redirect to dashboard
            const token = req.cookies.get("admin_token")?.value;
            if (token) {
                try {
                    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
                    await jwtVerify(token, secret);
                    return NextResponse.redirect(new URL("/admin", req.url));
                } catch (e) {
                    // Token invalid, allow access to login page
                }
            }
            return NextResponse.next();
        }

        // Check for token on other admin routes
        const token = req.cookies.get("admin_token")?.value;
        if (!token) {
            return NextResponse.redirect(new URL("/admin/login", req.url));
        }

        try {
            const secret = new TextEncoder().encode(process.env.JWT_SECRET);
            await jwtVerify(token, secret);
            return NextResponse.next();
        } catch (error) {
            // Invalid token
            const response = NextResponse.redirect(new URL("/admin/login", req.url));
            response.cookies.delete("admin_token");
            return response;
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: "/admin/:path*",
};
