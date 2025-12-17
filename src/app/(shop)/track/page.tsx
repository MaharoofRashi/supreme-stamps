"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PhoneInput } from "@/components/ui/phone-input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Package, Loader2, CheckCircle2, Truck, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type OrderStatus = "PENDING" | "PROCESSING" | "READY" | "DELIVERED";

type TrackResult = {
    friendlyId: string;
    status: OrderStatus;
    createdAt: string;
    deliveryMethod: string;
};

export default function TrackOrderPage() {
    const [orderId, setOrderId] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<TrackResult | null>(null);
    const [error, setError] = useState("");

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!orderId.trim() || !phoneNumber) {
            setError("Please enter both Order ID and Phone Number");
            return;
        }

        setIsLoading(true);
        setError("");
        setResult(null);

        try {
            const res = await fetch(`/api/orders/track?id=${encodeURIComponent(orderId.trim())}&phone=${encodeURIComponent(phoneNumber)}`);
            const data = await res.json();

            if (data.success) {
                setResult(data.order);
            } else {
                setError(data.message || "Order not found. Please check your details.");
            }
        } catch (e) {
            setError("Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const steps = [
        { id: "PENDING", label: "Order Placed", icon: Clock },
        { id: "PROCESSING", label: "Processing", icon: Package },
        { id: "READY", label: "Ready", icon: CheckCircle2 },
        { id: "DELIVERED", label: "Delivered", icon: Truck },
    ];

    const getCurrentStepIndex = (status: string) => steps.findIndex(s => s.id === status);

    return (
        <div className="container max-w-lg mx-auto py-20 px-4 min-h-[60vh]">
            <div className="text-center mb-10 space-y-4">
                <h1 className="text-4xl font-bold tracking-tight">Track Your Order</h1>
                <p className="text-muted-foreground">Enter your Order ID (e.g., SS-ABC123) and Phone Number to see the status.</p>
            </div>

            <Card className="mb-8 border-none shadow-xl bg-white/50 backdrop-blur-sm">
                <CardContent className="pt-6">
                    <form onSubmit={handleSearch} className="flex flex-col gap-4">
                        <Input
                            placeholder="Order ID (e.g., SS-ABC123)"
                            value={orderId}
                            onChange={(e) => setOrderId(e.target.value)}
                            className="text-lg h-12"
                        />
                        <PhoneInput
                            placeholder="Phone Number used for order"
                            value={phoneNumber}
                            onChange={(value) => setPhoneNumber(value || "")}
                            defaultCountry="AE"
                            className="text-lg h-12"
                        />
                        <Button type="submit" size="lg" className="h-12 w-full text-lg" disabled={isLoading}>
                            {isLoading ? <Loader2 className="mr-2 w-5 h-5 animate-spin" /> : <Search className="mr-2 w-5 h-5" />}
                            Track Order
                        </Button>
                    </form>
                    {error && <p className="text-destructive text-sm mt-3 font-medium text-center animate-in slide-in-from-top-1">{error}</p>}
                </CardContent>
            </Card>

            <AnimatePresence>
                {result && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                    >
                        <Card className="overflow-hidden border-none shadow-2xl">
                            <CardHeader className="bg-primary/5 border-b pb-4">
                                <div className="flex justify-between items-center">
                                    <div className="space-y-1">
                                        <CardTitle className="font-mono text-xl">{result.friendlyId}</CardTitle>
                                        <p className="text-xs text-muted-foreground">Ordered on {new Date(result.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    <div className="text-right">
                                        <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground hover:bg-primary/80">
                                            {result.status}
                                        </span>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-8 pb-8">
                                <div className="relative">
                                    {/* Line */}
                                    <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-muted" />

                                    <div className="space-y-8 relative">
                                        {steps.map((step, index) => {
                                            const currentIndex = getCurrentStepIndex(result.status);
                                            const isCompleted = index <= currentIndex;
                                            const isCurrent = index === currentIndex;

                                            return (
                                                <div key={step.id} className={`flex items-center gap-4 relative transition-colors duration-500 ${isCompleted ? "text-primary" : "text-muted-foreground"}`}>
                                                    <div className={`z-10 w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${isCompleted ? "bg-primary border-primary text-primary-foreground" : "bg-background border-muted"}`}>
                                                        <step.icon className="w-4 h-4" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className={`font-semibold  ${isCurrent ? "text-lg" : "text-sm"}`}>{step.label}</p>
                                                        {isCurrent && <p className="text-xs text-muted-foreground animate-pulse">Current Status</p>}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
