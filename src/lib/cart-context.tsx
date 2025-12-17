"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { StampConfig } from "@/types/stamp";

export type CartItem = {
    id: string; // Unique ID for the cart item
    config: StampConfig;
    price: number;
};

interface CartContextType {
    items: CartItem[];
    addToCart: (config: StampConfig, price: number) => void;
    removeFromCart: (id: string) => void;
    clearCart: () => void;
    cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);

    // Load cart from localStorage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem("supreme-stamps-cart");
        if (savedCart) {
            try {
                setItems(JSON.parse(savedCart));
            } catch (e) {
                console.error("Failed to parse cart", e);
            }
        }
    }, []);

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem("supreme-stamps-cart", JSON.stringify(items));
    }, [items]);

    const addToCart = (config: StampConfig, price: number) => {
        const newItem: CartItem = {
            id: crypto.randomUUID(),
            config,
            price,
        };
        setItems((prev) => [...prev, newItem]);
    };

    const removeFromCart = (id: string) => {
        setItems((prev) => prev.filter((item) => item.id !== id));
    };

    const clearCart = () => {
        setItems([]);
    };

    const cartTotal = items.reduce((total, item) => total + item.price, 0);

    return (
        <CartContext.Provider
            value={{
                items,
                addToCart,
                removeFromCart,
                clearCart,
                cartTotal,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
}
