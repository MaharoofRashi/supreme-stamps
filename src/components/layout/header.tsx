import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Stamp } from "lucide-react";

export function Header() {
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <Link href="/" className="flex items-center space-x-2 group">
                    <div className="bg-primary/10 p-1.5 rounded-lg group-hover:bg-primary/20 transition-colors">
                        <Stamp className="h-5 w-5 text-primary" />
                    </div>
                    <span className="text-xl font-bold tracking-tight">
                        Supreme Stamps
                    </span>
                </Link>
                <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
                    <Link href="#configurator" className="text-muted-foreground hover:text-primary transition-colors">
                        Create Stamp
                    </Link>
                    <Link href="/track-order" className="text-muted-foreground hover:text-primary transition-colors">
                        Track Order
                    </Link>
                    <Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                        Contact
                    </Link>
                </nav>
                <div className="flex items-center gap-4">
                    <Button className="font-semibold shadow-lg shadow-primary/20" asChild>
                        <Link href="#configurator">Order Now</Link>
                    </Button>
                </div>
            </div>
        </header>
    );
}
