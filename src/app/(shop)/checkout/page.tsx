"use client";

import { useCart } from "@/lib/cart-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { PhoneInput } from "@/components/ui/phone-input";

export default function CheckoutPage() {
    const { items, cartTotal, clearCart } = useCart();
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(false);
    const [successId, setSuccessId] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        customerName: "",
        customerEmail: "",
        customerPhone: "",
        address: "",
    });

    const [deliveryMethod, setDeliveryMethod] = useState<"DELIVERY" | "PICKUP">("DELIVERY");

    // Handle redirect in useEffect instead of during render
    useEffect(() => {
        if (items.length === 0 && !successId) {
            router.push("/cart");
        }
    }, [items.length, successId, router]);

    // Show loading state while redirecting
    if (items.length === 0 && !successId) {
        return null;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Step 1: Create order in database
            const payload = {
                customerName: formData.customerName,
                customerEmail: formData.customerEmail || "",
                customerPhone: formData.customerPhone,
                deliveryMethod,
                address: deliveryMethod === "DELIVERY" ? formData.address : undefined,
                totalPrice: cartTotal,
                items: items.map(item => ({
                    shape: item.config.shape,
                    color: item.config.color,
                    companyName: item.config.companyName || null,
                    companyNameAr: item.config.companyNameAr || null,
                    licenseNumber: item.config.licenseNumber || null,
                    emirate: item.config.emirate || null,
                    hasLogo: item.config.hasLogo,
                    tradeLicenseUrl: item.config.tradeLicenseUrl || null,
                    price: item.price
                }))
            };

            const orderResponse = await fetch("/api/orders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const orderData = await orderResponse.json();

            if (!orderResponse.ok) {
                if (orderData.errors) {
                    console.error("Validation Errors:", orderData.errors);
                    alert("Please check your input details.");
                } else {
                    throw new Error(orderData.message || "Failed to create order.");
                }
                setIsLoading(false);
                return;
            }

            // Step 2: Create Stripe checkout session
            const checkoutResponse = await fetch("/api/stripe/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ orderId: orderData.orderId }),
            });

            const checkoutData = await checkoutResponse.json();

            if (!checkoutResponse.ok) {
                throw new Error(checkoutData.message || "Failed to create payment session.");
            }

            // Step 3: Clear cart and redirect to Stripe
            clearCart();

            // Redirect to Stripe Checkout
            if (checkoutData.url) {
                window.location.href = checkoutData.url;
            } else {
                throw new Error("No checkout URL received");
            }

        } catch (error: any) {
            console.error(error);
            alert(error.message || "Checkout failed. Please try again.");
            setIsLoading(false);
        }
    };

    // No longer need success screen here - Stripe handles redirect


    return (
        <div className="container max-w-4xl mx-auto py-12 px-4">
            <Link href="/cart" className="flex items-center text-muted-foreground hover:text-foreground mb-6 transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Cart
            </Link>

            <h1 className="text-3xl font-bold mb-8">Secure Checkout</h1>

            <div className="grid gap-8 lg:grid-cols-12">
                {/* Left: Customer Form */}
                <div className="lg:col-span-7">
                    <Card>
                        <CardHeader>
                            <CardTitle>Contact Information</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form id="checkout-form" onSubmit={handleSubmit} className="space-y-6">
                                {/* Contact Info */}
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Full Name</Label>
                                        <Input
                                            id="name"
                                            required
                                            value={formData.customerName}
                                            onChange={e => setFormData({ ...formData, customerName: e.target.value })}
                                            placeholder="e.g. Ali Ahmed"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Phone Number</Label>
                                        <PhoneInput
                                            id="phone"
                                            value={formData.customerPhone}
                                            onChange={(value) => setFormData({ ...formData, customerPhone: value || "" })}
                                            placeholder="Enter phone number"
                                            defaultCountry="AE"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email Address <span className="text-muted-foreground font-normal">(Optional)</span></Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={formData.customerEmail}
                                            onChange={e => setFormData({ ...formData, customerEmail: e.target.value })}
                                            placeholder="ali@example.com"
                                        />
                                    </div>
                                </div>

                                {/* Delivery Method */}
                                <div className="space-y-3 pt-4 border-t">
                                    <Label className="text-base font-semibold">Delivery Method</Label>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div
                                            onClick={() => setDeliveryMethod("DELIVERY")}
                                            className={`border rounded-lg p-4 cursor-pointer transition-all ${deliveryMethod === "DELIVERY" ? "border-primary bg-primary/5 ring-1 ring-primary" : "hover:bg-accent"}`}
                                        >
                                            <div className="font-semibold flex items-center gap-2">🚚 Delivery</div>
                                            <div className="text-xs text-muted-foreground mt-1">Direct to your door</div>
                                        </div>
                                        <div
                                            onClick={() => setDeliveryMethod("PICKUP")}
                                            className={`border rounded-lg p-4 cursor-pointer transition-all ${deliveryMethod === "PICKUP" ? "border-primary bg-primary/5 ring-1 ring-primary" : "hover:bg-accent"}`}
                                        >
                                            <div className="font-semibold flex items-center gap-2">🏢 Pick-up</div>
                                            <div className="text-xs text-muted-foreground mt-1">Ready in 30 mins</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Conditional Fields */}
                                {deliveryMethod === "DELIVERY" ? (
                                    <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                                        <Label htmlFor="address">Delivery Address</Label>
                                        <Input
                                            id="address"
                                            required
                                            value={formData.address || ""}
                                            onChange={e => setFormData({ ...formData, address: e.target.value })}
                                            placeholder="Office 101, Building Name, Area, Dubai"
                                        />
                                    </div>
                                ) : (
                                    <div className="bg-secondary/50 p-4 rounded-lg text-sm space-y-2 animate-in fade-in slide-in-from-top-2">
                                        <p className="font-semibold text-primary">📍 Collection Point:</p>
                                        <p>Supreme Digital Business Services LLC</p>
                                        <p className="text-muted-foreground">Inside Max Metro Station, Al Jaffiliya, Dubai</p>
                                        <p className="text-muted-foreground">📞 +971 56 489 9004</p>
                                        <div className="pt-2 flex items-center gap-2 text-green-600 text-xs font-semibold">
                                            <Check className="w-3 h-3" /> Ready for collection 30 mins after order
                                        </div>
                                    </div>
                                )}
                            </form>
                        </CardContent>
                    </Card>
                </div>

                {/* Right: Order Summary */}
                <div className="lg:col-span-5">
                    <Card className="bg-muted/50 sticky top-24">
                        <CardHeader>
                            <CardTitle>Order Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                {items.map(item => (
                                    <div key={item.id} className="flex justify-between text-sm">
                                        <span>{item.config.shape} Stamp {item.config.hasLogo && "(+Logo)"}</span>
                                        <span className="font-medium">AED {item.price}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t pt-4 flex justify-between items-center font-bold text-lg">
                                <span>Total</span>
                                <span className="text-primary">AED {cartTotal}</span>
                            </div>

                            <Button
                                form="checkout-form"
                                type="submit"
                                size="lg"
                                className="w-full text-lg shadow-lg"
                                disabled={isLoading}
                            >
                                {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...</> : "Proceed to Payment"}
                            </Button>

                            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground text-center">
                                <span className="flex items-center gap-1"><Check className="w-3 h-3" /> Secure Payment via Stripe</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}