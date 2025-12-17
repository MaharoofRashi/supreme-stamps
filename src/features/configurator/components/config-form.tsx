import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import { StampConfig } from "@/types/stamp";

interface ConfigFormProps {
    config: StampConfig;
    setConfig: (config: StampConfig) => void;
    logoPrice: number;
}

export function ConfigForm({ config, setConfig, logoPrice }: ConfigFormProps) {
    return (
        <section className="space-y-4">
            <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm">4</div>
                <h2 className="text-xl font-semibold tracking-tight">Customize Details</h2>
            </div>

            <Card className="border-muted shadow-sm overflow-hidden">

                <div className="bg-secondary/30 p-4 border-b flex items-center justify-between">
                    <div className="space-y-0.5">
                        <Label className="text-base font-semibold">Pro Feature: Custom Logo</Label>
                        <p className="text-xs text-muted-foreground">Add your official branding (+ AED {logoPrice})</p>
                    </div>
                    <Switch
                        checked={config.hasLogo}
                        onCheckedChange={(checked) => setConfig({ ...config, hasLogo: checked })}
                        className="data-[state=checked]:bg-primary"
                    />
                </div>

                <CardContent className="p-6 space-y-6">
                    {config.hasLogo && (
                        <div className="border-2 border-dashed border-primary/30 bg-primary/5 rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-primary/10 transition-colors group">
                            <div className="p-4 rounded-full bg-background shadow-sm mb-4 group-hover:scale-110 transition-transform">
                                <Upload className="h-6 w-6 text-primary" />
                            </div>
                            <p className="text-sm font-semibold text-primary">Click to upload your logo</p>
                            <p className="text-xs text-muted-foreground mt-1">Supports SVG, PNG, JPG (High Quality)</p>
                        </div>
                    )}

                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="company-en">Company Name (English)</Label>
                            <Input
                                id="company-en"
                                placeholder="e.g. Supreme Stamps LLC"
                                value={config.companyName}
                                onChange={(e) => setConfig({ ...config, companyName: e.target.value })}
                                className="h-12 text-base"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="company-ar" className="flex justify-between"><span>Company Name (Arabic)</span> <span className="text-xs text-muted-foreground font-normal">(Optional)</span></Label>
                            <Input
                                id="company-ar"
                                placeholder="e.g. طوابع سوبريم ذ.م.م"
                                className="text-right h-12 text-base"
                                value={config.companyNameAr || ""}
                                onChange={(e) => setConfig({ ...config, companyNameAr: e.target.value })}
                                style={{ direction: 'rtl' }}
                            />
                        </div>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="emirate">Emirate</Label>
                            <Input
                                id="emirate"
                                value={config.emirate}
                                onChange={(e) => setConfig({ ...config, emirate: e.target.value })}
                                className="h-12"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="license" className="flex justify-between">
                                <span>License Number</span>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-muted-foreground">Show?</span>
                                    <Switch
                                        id="license-toggle"
                                        checked={config.hasLicenseNumber}
                                        onCheckedChange={(c) => setConfig({ ...config, hasLicenseNumber: c })}
                                        className="scale-75 origin-right"
                                    />
                                </div>
                            </Label>
                            <Input
                                id="license"
                                placeholder="e.g. 123456"
                                value={config.licenseNumber || ""}
                                disabled={!config.hasLicenseNumber}
                                onChange={(e) => setConfig({ ...config, licenseNumber: e.target.value })}
                                className={cn("h-12 transition-opacity", !config.hasLicenseNumber && "opacity-50")}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </section>
    );
}
