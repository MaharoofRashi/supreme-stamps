import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { SHAPES, Shape } from "@/types/stamp";
import { motion } from "framer-motion";

interface ShapeSelectorProps {
    selectedShape: Shape;
    onSelect: (shape: Shape) => void;
}

export function ShapeSelector({ selectedShape, onSelect }: ShapeSelectorProps) {
    return (
        <section className="space-y-4">
            <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm">1</div>
                <h2 className="text-xl font-semibold tracking-tight">Select Stamp Shape</h2>
            </div>
            <RadioGroup
                value={selectedShape}
                onValueChange={(val) => onSelect(val as Shape)}
                className="grid grid-cols-2 lg:grid-cols-4 gap-3"
            >
                {SHAPES.map((shape) => (
                    <motion.div key={shape.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Label
                            className={cn(
                                "relative flex flex-col items-center justify-center gap-3 rounded-xl border-2 p-3 cursor-pointer transition-colors duration-200 hover:border-primary/50 hover:bg-accent/40",
                                selectedShape === shape.id
                                    ? "border-primary bg-primary/10 shadow-lg backdrop-blur-sm"
                                    : "border-transparent bg-white/60 backdrop-blur-md hover:bg-white/80"
                            )}
                        >
                            <RadioGroupItem value={shape.id} className="sr-only" />
                            <div className={cn("flex items-center justify-center h-16 w-full transition-colors",
                                selectedShape === shape.id ? "text-primary" : "text-muted-foreground/20"
                            )}>
                                <div className={cn(
                                    "bg-current transition-all",
                                    shape.id === 'round' && "w-14 h-14 rounded-full",
                                    shape.id === 'square' && "w-14 h-14 rounded-lg",
                                    shape.id === 'rectangle' && "w-16 h-10 rounded-md",
                                    shape.id === 'oval' && "w-16 h-10 rounded-[50%]"
                                )} />
                            </div>
                            <span className={cn("font-medium text-sm", selectedShape === shape.id ? "text-primary" : "text-muted-foreground")}>{shape.label}</span>
                            {selectedShape === shape.id && (
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
