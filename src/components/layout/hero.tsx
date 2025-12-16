"use client";

import { Sparkles, ShieldCheck, Truck } from "lucide-react";
import { motion } from "framer-motion";

export function Hero() {
    return (
        <section className="relative w-full py-12 md:py-20 lg:py-24 overflow-hidden">
            {/* Background decorative elements */}
            {/* Grid moved to global background */}
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 0.2, scale: 1 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary/20 blur-[100px]"
            />

            <div className="container mx-auto px-4 text-center space-y-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80"
                >
                    <Sparkles className="w-3 h-3 mr-1 text-primary" />
                    Premium Quality Stamps
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="text-4xl font-extrabold tracking-tight lg:text-6xl max-w-4xl mx-auto"
                >
                    Official Company Stamps <br className="hidden md:block" />
                    <span className="text-primary">Designed in Minutes</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="max-w-2xl mx-auto text-muted-foreground text-lg md:text-xl leading-relaxed"
                >
                    The fastest way to order custom self-inking stamps in the UAE.
                    Upload your license, preview in real-time, and get free next-day delivery.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="flex items-center justify-center gap-6 pt-4 text-sm font-medium text-muted-foreground"
                >
                    <div className="flex items-center gap-1">
                        <ShieldCheck className="w-4 h-4 text-green-600" />
                        <span>Verified Quality</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Truck className="w-4 h-4 text-blue-600" />
                        <span>Free Delivery</span>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
