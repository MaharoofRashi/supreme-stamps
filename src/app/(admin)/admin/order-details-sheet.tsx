import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Phone, Mail, MapPin, FileText, ImageIcon, Download, MessageCircle } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

type OrderDetailsSheetProps = {
    order: any | null; // Using any for flexibility with Prisma types, or can import Order type
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export function OrderDetailsSheet({ order, open, onOpenChange }: OrderDetailsSheetProps) {
    if (!order) return null;

    // Helper to format WhatsApp link
    const getWhatsAppLink = (phone: string, orderId: string) => {
        const cleanPhone = phone.replace(/[^0-9]/g, "");
        const text = `Hello, regarding your order #${orderId.slice(-8)} from Supreme Stamps...`;
        return `https://wa.me/${cleanPhone}/?text=${encodeURIComponent(text)}`;
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
                <SheetHeader className="mb-6">
                    <div className="flex items-center justify-between">
                        <SheetTitle>Order Details</SheetTitle>
                        <Badge variant="outline" className="font-mono">#{order.id.slice(-8)}</Badge>
                    </div>
                    <SheetDescription>
                        Placed on {format(new Date(order.createdAt), "PPP p")}
                    </SheetDescription>
                </SheetHeader>

                <div className="space-y-6">
                    {/* Customer Information */}
                    <div className="space-y-4">
                        <h3 className="font-semibold flex items-center gap-2">
                            <span className="w-1 h-4 bg-primary rounded-full" /> Customer Info
                        </h3>
                        <div className="grid gap-3 text-sm border p-4 rounded-lg bg-muted/20">
                            <div className="flex items-center gap-2">
                                <span className="font-medium text-lg">{order.customerName}</span>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Phone className="w-4 h-4" />
                                <span>{order.customerPhone}</span>
                                <Link
                                    href={getWhatsAppLink(order.customerPhone, order.id)}
                                    target="_blank"
                                    className="ml-auto"
                                >
                                    <Button size="sm" variant="secondary" className="h-7 text-green-700 bg-green-100 hover:bg-green-200 border-green-200">
                                        <MessageCircle className="w-3 h-3 mr-1.5" /> Chat
                                    </Button>
                                </Link>
                            </div>
                            {order.customerEmail && (
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Mail className="w-4 h-4" />
                                    <a href={`mailto:${order.customerEmail}`} className="hover:underline">
                                        {order.customerEmail}
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Delivery Information */}
                    <div className="space-y-4">
                        <h3 className="font-semibold flex items-center gap-2">
                            <span className="w-1 h-4 bg-amber-500 rounded-full" /> Delivery Method
                        </h3>
                        <div className="border p-4 rounded-lg bg-muted/20 text-sm">
                            <div className="flex items-center justify-between mb-2">
                                <span className="font-medium">Type</span>
                                <Badge>{order.deliveryMethod}</Badge>
                            </div>
                            {order.deliveryMethod === "DELIVERY" && order.address && (
                                <div className="flex gap-2 text-muted-foreground mt-2 pt-2 border-t">
                                    <MapPin className="w-4 h-4 shrink-0 mt-0.5" />
                                    <span>{order.address}</span>
                                </div>
                            )}
                            {order.deliveryMethod === "PICKUP" && (
                                <p className="text-muted-foreground mt-2 pt-2 border-t text-xs">
                                    Customer will collect from the store.
                                </p>
                            )}
                        </div>
                    </div>

                    <Separator />

                    {/* Items List */}
                    <div className="space-y-4">
                        <h3 className="font-semibold flex items-center gap-2">
                            <span className="w-1 h-4 bg-blue-500 rounded-full" /> Order Items ({order.items.length})
                        </h3>

                        <div className="space-y-4">
                            {order.items.map((item: any, i: number) => (
                                <div key={item.id} className="border rounded-lg overflow-hidden">
                                    <div className="bg-muted/30 px-4 py-2 border-b flex justify-between items-center text-sm">
                                        <span className="font-medium">Item #{i + 1}</span>
                                        <span className="font-mono font-bold">AED {item.price}</span>
                                    </div>
                                    <div className="p-4 space-y-3 text-sm">
                                        <div className="grid grid-cols-2 gap-2">
                                            <div>
                                                <span className="text-xs text-muted-foreground block">Shape</span>
                                                <span className="font-medium capitalize">{item.shape}</span>
                                            </div>
                                            <div>
                                                <span className="text-xs text-muted-foreground block">Color</span>
                                                <div className="flex items-center gap-1">
                                                    <span className={`w-3 h-3 rounded-full bg-${item.color}-600 border`} style={{ backgroundColor: item.color }} />
                                                    <span className="font-medium capitalize">{item.color}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {(item.companyName || item.companyNameAr) && (
                                            <div className="mt-2 text-sm bg-secondary/50 p-2 rounded">
                                                <span className="text-xs text-muted-foreground block mb-1">Text on Stamp</span>
                                                {item.companyName && <div className="font-medium">EN: {item.companyName}</div>}
                                                {item.companyNameAr && <div className="font-medium font-arabic">AR: {item.companyNameAr}</div>}
                                            </div>
                                        )}

                                        <div className="grid grid-cols-2 gap-2">
                                            {item.licenseNumber && (
                                                <div>
                                                    <span className="text-xs text-muted-foreground block">License No.</span>
                                                    <span>{item.licenseNumber}</span>
                                                </div>
                                            )}
                                            {item.emirate && (
                                                <div>
                                                    <span className="text-xs text-muted-foreground block">Emirate</span>
                                                    <span>{item.emirate}</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Files Section */}
                                        {(item.tradeLicenseUrl || item.logoUrl) && (
                                            <div className="pt-3 mt-1 border-t flex flex-wrap gap-2">
                                                {item.tradeLicenseUrl && (
                                                    <Button variant="outline" size="sm" className="h-8 gap-1" asChild>
                                                        <a href={item.tradeLicenseUrl} target="_blank" rel="noreferrer">
                                                            <FileText className="w-3.5 h-3.5" /> License
                                                        </a>
                                                    </Button>
                                                )}
                                                {item.logoUrl && (
                                                    <Button variant="outline" size="sm" className="h-8 gap-1" asChild>
                                                        <a href={item.logoUrl} target="_blank" rel="noreferrer">
                                                            <ImageIcon className="w-3.5 h-3.5" /> Logo
                                                        </a>
                                                    </Button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <Separator />

                    <div className="flex justify-between items-center py-4">
                        <span className="text-muted-foreground font-medium">Total Amount</span>
                        <span className="text-2xl font-bold">AED {order.totalPrice}</span>
                    </div>

                </div>
            </SheetContent>
        </Sheet>
    );
}
