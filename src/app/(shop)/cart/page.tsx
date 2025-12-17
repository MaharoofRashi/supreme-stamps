"use client";

import { useCart } from "@/lib/cart-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { SHAPES } from "@/types/stamp";

export default function CartPage() {
    const { items, removeFromCart, cartTotal } = useCart();

    if (items.length === 0) {
        return (
            <div className="container max-w-4xl mx-auto py-20 text-center space-y-4">
                <h1 className="text-3xl font-bold">Your Cart is Empty</h1>
                <p className="text-muted-foreground">Looks like you haven't customized any stamps yet.</p>
                <Link href="/">
                    <Button size="lg" className="mt-4">
                        Start Designing
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="container max-w-4xl mx-auto py-12 px-4">
            <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

            <div className="grid gap-8 lg:grid-cols-3">
                {/* Cart Items List */}
                <div className="lg:col-span-2 space-y-4">
                    {items.map((item) => (
                        <Card key={item.id} className="overflow-hidden">
                            <CardContent className="p-6 flex items-start justify-between gap-4">
                                <div className="space-y-1">
                                    <h3 className="font-semibold text-lg">
                                        {SHAPES.find(s => s.id === item.config.shape)?.label} Stamp
                                    </h3>
                                    <div className="text-sm text-muted-foreground space-y-1">
                                        <p>Color: <span className="capitalize">{item.config.color}</span></p>
                                        <p>Company: {item.config.companyName || "N/A"}</p>
                                        {item.config.hasLogo && <p className="text-primary text-xs font-medium">+ Custom Logo</p>}
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-4">
                                    <span className="font-bold text-lg">AED {item.price}</span>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                        onClick={() => removeFromCart(item.id)}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Summary Sidebar */}
                <div className="lg:col-span-1">
                    <Card className="sticky top-24">
                        <CardContent className="p-6 space-y-6">
                            <h2 className="text-xl font-semibold">Order Summary</h2>
                            <div className="flex justify-between items-center text-lg font-bold">
                                <span>Total</span>
                                <span className="text-primary">AED {cartTotal}.00</span>
                            </div>
                            <Link href="/checkout" className="block w-full">
                                <Button size="lg" className="w-full text-lg">
                                    Proceed to Checkout <ArrowRight className="ml-2 w-4 h-4" />
                                </Button>
                            </Link>
                            <Link href="/" className="block w-full text-center">
                                <Button variant="link" className="text-muted-foreground">
                                    Continue Shopping
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
