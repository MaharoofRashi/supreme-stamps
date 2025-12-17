"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";
import Link from "next/link";

export default function CheckoutCancelPage() {
    return (
        <div className="container max-w-2xl mx-auto py-20 px-4 text-center space-y-6">
            <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto text-orange-600">
                <XCircle className="w-10 h-10" />
            </div>
            <h1 className="text-3xl font-bold text-orange-800">Payment Cancelled</h1>
            <p className="text-muted-foreground">
                Your payment was cancelled. No charges have been made.
            </p>
            <Card>
                <CardHeader>
                    <CardTitle>What would you like to do?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                        Your items are still in your cart. You can complete your purchase anytime.
                    </p>
                    <div className="flex gap-3 justify-center pt-4">
                        <Link href="/cart">
                            <Button>Return to Cart</Button>
                        </Link>
                        <Link href="/">
                            <Button variant="outline">Continue Shopping</Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
