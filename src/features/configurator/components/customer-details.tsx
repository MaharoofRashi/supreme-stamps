import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { User } from "lucide-react";
import { StampConfig } from "@/types/stamp";

interface CustomerDetailsProps {
    config: StampConfig;
    setConfig: (config: StampConfig) => void;
}

export function CustomerDetails({ config, setConfig }: CustomerDetailsProps) {
    return (
        <section className="space-y-4">
            <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm">5</div>
                <h2 className="text-xl font-semibold tracking-tight">Contact Information</h2>
            </div>

            <Card className="border-muted shadow-sm overflow-hidden">
                <div className="bg-secondary/30 p-4 border-b flex items-center gap-2">
                    <User className="w-5 h-5 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">We need these details to contact you for delivery.</p>
                </div>

                <CardContent className="p-6 grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="customer-name">Full Name</Label>
                        <Input
                            id="customer-name"
                            placeholder="e.g. Ahmed Al-Maktoum"
                            value={config.customerName || ""}
                            onChange={(e) => setConfig({ ...config, customerName: e.target.value })}
                            className="h-12"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="customer-phone">Phone Number</Label>
                        <Input
                            id="customer-phone"
                            placeholder="e.g. 050 123 4567"
                            type="tel"
                            value={config.customerPhone || ""}
                            onChange={(e) => setConfig({ ...config, customerPhone: e.target.value })}
                            className="h-12"
                        />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="customer-email">Email Address <span className="text-muted-foreground font-normal text-xs">(Optional)</span></Label>
                        <Input
                            id="customer-email"
                            placeholder="e.g. ahmed@company.com"
                            type="email"
                            value={config.customerEmail || ""}
                            onChange={(e) => setConfig({ ...config, customerEmail: e.target.value })}
                            className="h-12"
                        />
                    </div>
                </CardContent>
            </Card>
        </section>
    );
}
