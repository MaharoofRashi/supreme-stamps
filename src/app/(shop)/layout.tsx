import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { AnimatedBackground } from "@/components/ui/animated-background";
import { CartProvider } from "@/lib/cart-context";

export default function ShopLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <AnimatedBackground />
            <CartProvider>
                <Header />
                <main className="flex-1">
                    {children}
                </main>
                <Footer />
            </CartProvider>
        </>
    );
}
