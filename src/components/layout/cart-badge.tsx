"use client";

import { useCart } from "@/lib/cart-context";

export function CartBadge() {
    const { items } = useCart();

    if (items.length === 0) return null;

    return (
        <span className="absolute top-0 right-0 h-4 w-4 flex items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground transform translate-x-1 -translate-y-1">
            {items.length}
        </span>
    );
}
