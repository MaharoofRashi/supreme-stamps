import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Check } from "lucide-react";
import { SHAPES, StampConfig } from "@/types/stamp";

interface OrderSummaryProps {
    config: StampConfig;
    basePrice: number;
    logoPrice: number;
    totalPrice: number;
}

export function OrderSummary({ config, basePrice, logoPrice, totalPrice }: OrderSummaryProps) {
    return (
        <Card className="border-muted bg-card">
            <CardHeader className="pb-4">
                <CardTitle>Order Summary</CardTitle>
                <CardDescription>Review your customization before ordering</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center py-2 border-b border-dashed">
                        <span className="text-muted-foreground">Self-Inking Stamp ({SHAPES.find(s => s.id === config.shape)?.label})</span>
                        <span className="font-medium">AED {basePrice}.00</span>
                    </div>
                    {config.hasLogo && (
                        <div className="flex justify-between items-center py-2 border-b border-dashed text-primary/80">
                            <div className="flex items-center gap-2">
                                <Check className="w-3 h-3" />
                                <span>Custom Logo Integration</span>
                            </div>
                            <span className="font-medium">AED {logoPrice}.00</span>
                        </div>
                    )}
                    <div className="flex justify-between items-center py-2">
                        <span className="text-muted-foreground">Standard Delivery</span>
                        <span className="text-green-600 font-bold text-xs bg-green-100 dark:bg-green-900/30 px-2 py-0.5 rounded-full">FREE</span>
                    </div>
                </div>

                <div className="bg-primary/5 p-4 rounded-lg flex justify-between items-center border border-primary/10">
                    <span className="font-bold text-lg">Total</span>
                    <span className="font-bold text-2xl text-primary">AED {totalPrice}.00</span>
                </div>

                <Button size="lg" className="w-full text-lg h-14 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-shadow">
                    Proceed to Secure Checkout
                </Button>

                <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Check className="w-3 h-3" /> Secure Payment</span>
                    <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
                    <span className="flex items-center gap-1"><Check className="w-3 h-3" /> Satisfaction Guaranteed</span>
                </div>
            </CardContent>
        </Card>
    );
}
