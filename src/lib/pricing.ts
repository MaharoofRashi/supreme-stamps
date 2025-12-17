import { StampConfig } from "@/types/stamp";

// Business Logic
// Valid as of Dec 2025
export const BASE_PRICE = 149;
export const LOGO_PRICE = 49;

export function calculatePrice(config: Partial<StampConfig>): {
    basePrice: number;
    logoPrice: number;
    totalPrice: number;
} {
    const basePrice = BASE_PRICE;
    const logoPrice = config.hasLogo ? LOGO_PRICE : 0;
    const totalPrice = basePrice + logoPrice;

    return {
        basePrice,
        logoPrice,
        totalPrice,
    };
}
