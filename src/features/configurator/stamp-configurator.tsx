"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Sparkles } from "lucide-react";
import { useStampConfig } from "./hooks/use-stamp-config";
import { ShapeSelector } from "./components/shape-selector";
import { ColorSelector } from "./components/color-selector";
import { ConfigForm } from "./components/config-form";
import { DocumentUpload } from "./components/document-upload";
import { StampPreview } from "./components/stamp-preview";
import { OrderSummary } from "./components/order-summary";
import { CustomerDetails } from "./components/customer-details"; // Imported

export function StampConfigurator() {
    const { config, setConfig, basePrice, logoPrice, totalPrice } = useStampConfig();

    return (
        <div className="grid gap-12 lg:grid-cols-12 pb-20 items-start">
            {/* Left Panel - Configuration */}
            <div className="lg:col-span-7 space-y-10">
                <ShapeSelector
                    selectedShape={config.shape}
                    onSelect={(shape) => setConfig({ ...config, shape })}
                />

                <ColorSelector
                    selectedColor={config.color}
                    onSelect={(color) => setConfig({ ...config, color })}
                />

                <DocumentUpload
                    config={config}
                    setConfig={setConfig}
                />

                <ConfigForm
                    config={config}
                    setConfig={setConfig}
                    logoPrice={logoPrice}
                />
            </div>

            {/* Right Panel - Preview & Summary */}
            <div className="lg:col-span-5 relative">
                <div className="lg:sticky lg:top-24 space-y-6">

                    <div className="space-y-2">
                        <h3 className="font-semibold text-lg flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-primary" /> Live Preview
                        </h3>
                        {/* Preview Card */}
                        <Card className="overflow-hidden border-0 shadow-2xl ring-1 ring-black/5 bg-white/70 backdrop-blur-xl relative">
                            {/* Paper texture effect overlay (CSS only) */}
                            <div className="absolute inset-0 opacity-40 pointer-events-none mix-blend-multiply"
                                style={{
                                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.5'/%3E%3C/svg%3E")`,
                                    backgroundSize: '200px 200px'
                                }}
                            />

                            <CardContent className="p-10 flex items-center justify-center min-h-[350px] relative z-10">
                                <div className="transform transition-all duration-300 hover:scale-105 filter drop-shadow-xl ">
                                    <StampPreview config={config} />
                                </div>
                            </CardContent>
                            <div className="absolute bottom-4 right-4 text-[10px] text-muted-foreground bg-white/80 px-2 py-1 rounded-full border">
                                Actual Text Scale (1:1)
                            </div>
                        </Card>
                    </div>

                    <OrderSummary
                        config={config}
                        basePrice={basePrice}
                        logoPrice={logoPrice}
                        totalPrice={totalPrice}
                    />
                </div>
            </div>
        </div>
    );
}
