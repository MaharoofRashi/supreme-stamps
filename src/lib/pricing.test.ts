import { describe, it, expect } from "vitest";
import { calculatePrice, BASE_PRICE, LOGO_PRICE } from "./pricing";

describe("Pricing Logic", () => {
    it("should return the correct base price", () => {
        const result = calculatePrice({ hasLogo: false });
        expect(result.basePrice).toBe(149);
        expect(result.logoPrice).toBe(0);
        expect(result.totalPrice).toBe(149);
    });

    it("should add logo price when hasLogo is true", () => {
        const result = calculatePrice({ hasLogo: true });
        expect(result.basePrice).toBe(149);
        expect(result.logoPrice).toBe(49);
        expect(result.totalPrice).toBe(198);
    });

    it("should always use the defined constants", () => {
        const result = calculatePrice({ hasLogo: true });
        expect(result.basePrice).toBe(BASE_PRICE);
        expect(result.logoPrice).toBe(LOGO_PRICE);
    });
});
