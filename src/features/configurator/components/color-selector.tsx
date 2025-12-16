import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { COLORS, Color } from "@/types/stamp";
import { motion } from "framer-motion";

interface ColorSelectorProps {
    selectedColor: Color;
    onSelect: (color: Color) => void;
}

export function ColorSelector({ selectedColor, onSelect }: ColorSelectorProps) {
    return (
        <section className="space-y-4">
            <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm">2</div>
                <h2 className="text-xl font-semibold tracking-tight">Choose Ink Color</h2>
            </div>
            <RadioGroup
                value={selectedColor}
                onValueChange={(val) => onSelect(val as Color)}
                className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
                {COLORS.map((color) => (
                    <motion.div key={color.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Label
                            className={cn(
                                "relative flex flex-col items-center justify-center gap-3 rounded-xl border-2 p-4 cursor-pointer transition-colors duration-200 hover:border-primary/50 hover:bg-accent/40",
                                selectedColor === color.id
                                    ? "border-primary bg-primary/10 shadow-lg backdrop-blur-sm"
                                    : "border-transparent bg-white/60 backdrop-blur-md hover:bg-white/80"
                            )}
                        >
                            <RadioGroupItem value={color.id} className="sr-only" />
                            <motion.div
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className={cn(
                                    "flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 shadow-sm border",
                                    color.value
                                )}>
                                {selectedColor === color.id &&
                                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                                        <Check className="w-5 h-5 text-white drop-shadow-md" />
                                    </motion.div>
                                }
                            </motion.div>
                            <span className={cn("font-medium text-sm", selectedColor === color.id ? "text-primary" : "text-muted-foreground")}>{color.label}</span>
                            {selectedColor === color.id && (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="absolute top-2 right-2 text-primary"
                                >
                                    <Check className="w-4 h-4" />
                                </motion.div>
                            )}
                        </Label>
                    </motion.div>
                ))}
            </RadioGroup>
        </section>
    );
}
