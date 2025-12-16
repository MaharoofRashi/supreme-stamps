import Link from "next/link";

export function Footer() {
    return (
        <footer className="w-full border-t bg-card">
            <div className="container mx-auto px-4 py-12 md:py-16">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="md:col-span-2 space-y-4">
                        <span className="text-xl font-bold tracking-tight text-primary">
                            Supreme Stamps
                        </span>
                        <p className="text-sm text-muted-foreground max-w-md">
                            The #1 choice for corporate stamps in the UAE. We provide high-quality, long-lasting self-inking stamps with officially compliant designs.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <h4 className="font-semibold">Quick Links</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/" className="hover:text-primary transition-colors">Start Order</Link></li>
                            <li><Link href="/track-order" className="hover:text-primary transition-colors">Track Order</Link></li>
                            <li><Link href="/contact" className="hover:text-primary transition-colors">Contact Support</Link></li>
                        </ul>
                    </div>

                    <div className="space-y-4">
                        <h4 className="font-semibold">Legal</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
                            <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                            <li><Link href="/refunds" className="hover:text-primary transition-colors">Refund Policy</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
                    <p>© {new Date().getFullYear()} Supreme Stamps. All rights reserved.</p>
                    <p>Made with ❤️ in Dubai</p>
                </div>
            </div>
        </footer>
    );
}
