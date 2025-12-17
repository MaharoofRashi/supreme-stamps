import { useState } from "react";
import { StampConfig } from "@/types/stamp";
import { calculatePrice } from "@/lib/pricing";

export function useStampConfig(initialConfig?: Partial<StampConfig>) {
    const [config, setConfig] = useState<StampConfig>({
        shape: "round",
        color: "blue",
        companyName: "",
        companyNameAr: "", // Initialize to empty string
        licenseNumber: "", // Initialize to empty string
        emirate: "Dubai",
        poBox: "",
        hasLogo: false,
        hasLicenseNumber: true,
        tradeLicense: null,
        customerName: "",
        customerEmail: "",
        customerPhone: "",
        ...initialConfig,
    });

    const { basePrice, logoPrice, totalPrice } = calculatePrice(config);

    return {
        config,
        setConfig,
        basePrice,
        logoPrice,
        totalPrice,
    };
}
