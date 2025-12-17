export type Shape = "round" | "rectangle" | "square" | "oval";
export type Color = "black" | "blue" | "red" | "green";

export interface StampConfig {
    shape: Shape;
    color: Color;
    companyName: string;
    companyNameAr?: string;
    licenseNumber?: string;
    emirate: string;
    poBox?: string;
    hasLogo: boolean;
    hasLicenseNumber: boolean;
    // Customer Details
    customerName?: string;
    customerEmail?: string;
    customerPhone?: string;

    tradeLicense: File | null;
    tradeLicenseUrl?: string;
}

export const SHAPES: { id: Shape; label: string; aspect: string }[] = [
    { id: "round", label: "Round", aspect: "aspect-square" },
    { id: "rectangle", label: "Rectangle", aspect: "aspect-[2/1]" },
    { id: "square", label: "Square", aspect: "aspect-square" },
    { id: "oval", label: "Oval", aspect: "aspect-[3/2]" },
];

export const COLORS: { id: Color; label: string; value: string; ring: string }[] = [
    { id: "black", label: "Black", value: "bg-black", ring: "ring-black" },
    { id: "blue", label: "Blue", value: "bg-blue-600", ring: "ring-blue-600" },
    { id: "red", label: "Red", value: "bg-red-600", ring: "ring-red-600" },
    { id: "green", label: "Green", value: "bg-green-600", ring: "ring-green-600" },
];

// Prices moved to src/lib/pricing.ts
