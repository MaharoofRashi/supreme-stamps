import { useState } from "react";
import { StampConfig, BASE_PRICE, LOGO_PRICE } from "@/types/stamp";

export function useStampConfig() {
    const [config, setConfig] = useState<StampConfig>({
        shape: "round",
        color: "blue",
        companyName: "",
        emirate: "Dubai",
        hasLogo: false,
        hasLicenseNumber: true,
        tradeLicense: null,
    });

    const basePrice = BASE_PRICE;
    const logoPrice = config.hasLogo ? LOGO_PRICE : 0;
    const totalPrice = basePrice + logoPrice;

    return {
        config,
        setConfig,
        basePrice,
        logoPrice,
        totalPrice,
    };
}
