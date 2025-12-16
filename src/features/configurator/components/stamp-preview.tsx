import { StampConfig, Color } from "@/types/stamp";
import { motion, AnimatePresence } from "framer-motion";

interface StampPreviewProps {
    config: StampConfig;
}

export function StampPreview({ config }: StampPreviewProps) {
    // Map color names to hex/classes for SVG
    const colorMap: Record<Color, string> = {
        black: "#1a1a1a", // Softer black for realistic ink look
        blue: "#1e40af",
        red: "#b91c1c",
        green: "#15803d",
    };

    const inkColor = colorMap[config.color];

    // Helper to render shape paths
    const renderShape = () => {
        switch (config.shape) {
            case "round":
                return (
                    <>
                        <circle cx="150" cy="150" r="140" fill="none" stroke={inkColor} strokeWidth="5" />
                        <circle cx="150" cy="150" r="130" fill="none" stroke={inkColor} strokeWidth="1.5" />
                        <path id="curveTop" d="M 40,150 A 110,110 0 0,1 260,150" fill="none" />
                        <path id="curveBottom" d="M 40,150 A 110,110 0 0,0 260,150" fill="none" />
                    </>
                );
            case "rectangle":
                return (
                    <>
                        <rect x="10" y="50" width="280" height="200" rx="12" fill="none" stroke={inkColor} strokeWidth="5" />
                        <rect x="20" y="60" width="260" height="180" rx="6" fill="none" stroke={inkColor} strokeWidth="1.5" />
                    </>
                );
            case "square":
                return (
                    <>
                        <rect x="20" y="20" width="260" height="260" rx="4" fill="none" stroke={inkColor} strokeWidth="5" />
                        <rect x="30" y="30" width="240" height="240" rx="2" fill="none" stroke={inkColor} strokeWidth="1.5" />
                    </>
                );
            case "oval":
                return (
                    <>
                        <ellipse cx="150" cy="150" rx="140" ry="100" fill="none" stroke={inkColor} strokeWidth="5" />
                        <ellipse cx="150" cy="150" rx="130" ry="90" fill="none" stroke={inkColor} strokeWidth="1.5" />
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <div className="relative w-full max-w-[300px] aspect-square flex items-center justify-center">
            {/* SVG with multiply blend mode for ink effect */}
            <AnimatePresence mode="wait">
                <motion.svg
                    key={config.shape}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                    viewBox="0 0 300 300"
                    className="w-full h-full mix-blend-multiply opacity-90"
                >
                    {renderShape()}

                    {/* Placeholder Text Logic */}
                    {!config.hasLogo && (
                        <text x="150" y="150" textAnchor="middle" fill={inkColor} className="font-bold text-2xl uppercase tracking-widest" dy="0.35em" style={{ fontFamily: 'var(--font-geist-mono)' }}>
                            {config.companyName || "COMPANY NAME"}
                        </text>
                    )}

                    {config.shape === 'round' && (
                        <text width="500">
                            <textPath href="#curveTop" startOffset="50%" textAnchor="middle" fill={inkColor} className="font-bold uppercase tracking-widest" style={{ fontSize: '24px' }}>
                                {config.companyNameAr || "اسم الشركة بالعربية"}
                            </textPath>
                            <textPath href="#curveBottom" startOffset="50%" textAnchor="middle" fill={inkColor} className="font-bold tracking-wide" style={{ fontSize: '18px' }}>
                                {config.emirate.toUpperCase()} - U.A.E.
                            </textPath>
                        </text>
                    )}

                    {config.shape !== 'round' && (
                        <text x="150" y={config.hasLogo ? 220 : 190} textAnchor="middle" fill={inkColor} className="font-bold tracking-wide" style={{ fontSize: '16px' }}>
                            {config.emirate} - U.A.E.
                        </text>
                    )}

                    {config.hasLicenseNumber && (
                        <text x="150" y={config.shape === 'round' ? 200 : 215} textAnchor="middle" fill={inkColor} className="font-mono text-xs" style={{ fontSize: '12px', letterSpacing: '0.1em' }} opacity="0.8">
                            LIC: {config.licenseNumber || "123456"}
                        </text>
                    )}
                </motion.svg>
            </AnimatePresence>
        </div>
    );
}
