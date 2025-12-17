"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Loader2 } from "lucide-react";
import Link from "next/link";

export default function CheckoutSuccessPage() {
    const searchParams = useSearchParams();
    const sessionId = searchParams.get("session_id");
    const [isVerifying, setIsVerifying] = useState(true);
    const [orderDetails, setOrderDetails] = useState<{
        orderId: string;
        friendlyId: string;
    } | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!sessionId) {
            setError("No session ID provided");
            setIsVerifying(false);
            return;
        }

        // Verify the payment session
        fetch(`/api/stripe/verify-session?session_id=${sessionId}`)
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    setOrderDetails({
                        orderId: data.orderId,
                        friendlyId: data.friendlyId,
                    });
                } else {
                    setError(data.message || "Failed to verify payment");
                }
            })
            .catch(() => {
                setError("Failed to verify payment");
            })
            .finally(() => {
                setIsVerifying(false);
            });
    }, [sessionId]);

    if (isVerifying) {
        return (
            <div className="container max-w-2xl mx-auto py-20 px-4 text-center">
                <Loader2 className="w-16 h-16 animate-spin mx-auto text-primary" />
                <p className="mt-4 text-muted-foreground">Verifying your payment...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container max-w-2xl mx-auto py-20 px-4 text-center">
                <Card className="border-destructive">
                    <CardHeader>
                        <CardTitle className="text-destructive">Payment Verification Failed</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground mb-4">{error}</p>
                        <Link href="/cart">
                            <Button>Return to Cart</Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="container max-w-2xl mx-auto py-20 px-4 text-center space-y-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600">
                <Check className="w-10 h-10" />
            </div>
            <h1 className="text-3xl font-bold text-green-800">Payment Successful!</h1>
            <p className="text-muted-foreground">
                Your payment has been processed and your order is confirmed.
            </p>
            {orderDetails && (
                <Card>
                    <CardHeader>
                        <CardTitle>Order Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <p className="text-sm text-muted-foreground">Order ID</p>
                            <p className="font-mono font-bold text-xl">{orderDetails.friendlyId}</p>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            A confirmation email has been sent to your email address with all the details.
                        </p>
                        <div className="flex gap-3 justify-center pt-4">
                            <Link href="/track">
                                <Button>Track Order</Button>
                            </Link>
                            <Link href="/">
                                <Button variant="outline">Back to Home</Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
