import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import Link from "next/link";
import { AnimatedBackground } from "@/components/ui/animated-background";
import { logout } from "./actions";
import { Toaster } from "sonner";

export default function AdminLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="min-h-screen flex flex-col relative overflow-hidden">
            <AnimatedBackground />

            <header className="sticky top-0 z-50 w-full border-b bg-background/60 backdrop-blur-md">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <Link href="/admin" className="flex items-center gap-2 font-bold text-xl tracking-tight z-10">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white shadow-md">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                                <path d="M12 2v20M2 12h20" />
                            </svg>
                        </div>
                        <span>Supreme Stamps <span className="text-xs font-normal text-muted-foreground ml-1 bg-secondary px-2 py-0.5 rounded-full">Admin</span></span>
                    </Link>

                    <form action={logout} className="z-10">
                        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-destructive">
                            <LogOut className="w-4 h-4 mr-2" /> Logout
                        </Button>
                    </form>
                </div>
            </header>

            <main className="flex-1 relative z-10">
                {children}
            </main>

            <footer className="py-6 border-t bg-white/30 backdrop-blur-sm relative z-10">
                <div className="container mx-auto px-4 text-center text-xs text-muted-foreground">
                    &copy; {new Date().getFullYear()} Supreme Stamps. Admin Portal.
                </div>
            </footer>
            <Toaster />
        </div>
    );
}
