"use client";

import { motion } from "framer-motion";
import React from "react";

export function AnimatedBackground() {
    return (
        <div className="fixed inset-0 -z-50 overflow-hidden">
            {/* Note: Removed bg-background to prevent double layering, using root background */}

            {/* Stronger Dot Pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1.5px,transparent_1.5px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,#000_60%,transparent_100%)] opacity-60" />

            {/* Primary Gold Orb - Much more visible */}
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 0.8, 0.5], // Increased from 0.4
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] rounded-full bg-primary/40 blur-[80px] mix-blend-multiply"
            />

            {/* Secondary Blue Orb - Stronger presence */}
            <motion.div
                animate={{
                    y: [0, -60, 0],
                    x: [0, 40, 0],
                    opacity: [0.4, 0.7, 0.4] // Increased from 0.3
                }}
                transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className="absolute top-0 right-0 w-[50vw] h-[50vw] rounded-full bg-blue-300/40 blur-[90px] mix-blend-multiply"
            />

            {/* Tertiary Warm Orb */}
            <motion.div
                animate={{
                    y: [0, 60, 0],
                    x: [0, -40, 0],
                    opacity: [0.4, 0.7, 0.4] // Increased from 0.3
                }}
                transition={{
                    duration: 12,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className="absolute bottom-0 left-0 w-[50vw] h-[50vw] rounded-full bg-orange-300/40 blur-[90px] mix-blend-multiply"
            />
        </div>
    );
}
