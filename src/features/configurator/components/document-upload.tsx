import { Label } from "@/components/ui/label";
import { FileUp, FileCheck } from "lucide-react";
import { StampConfig } from "@/types/stamp";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface DocumentUploadProps {
    config: StampConfig;
    setConfig: (config: StampConfig) => void;
}

export function DocumentUpload({ config, setConfig }: DocumentUploadProps) {
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setConfig({ ...config, tradeLicense: e.target.files[0] });
        }
    };

    return (
        <section className="space-y-4">
            <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm">3</div>
                <h2 className="text-xl font-semibold tracking-tight">Upload Trade License</h2>
            </div>

            <div className="group relative">
                <input
                    type="file"
                    id="trade-license"
                    className="hidden"
                    accept=".pdf,.png,.jpg,.jpeg"
                    onChange={handleFileChange}
                />
                <Label
                    htmlFor="trade-license"
                    className={cn(
                        "flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200",
                        config.tradeLicense
                            ? "border-green-500/50 bg-green-500/5"
                            : "border-muted-foreground/25 hover:border-primary/50 hover:bg-accent/40"
                    )}
                >
                    <AnimatePresence mode="wait">
                        {config.tradeLicense ? (
                            <motion.div
                                key="file-uploaded"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex flex-col items-center gap-2 text-green-700"
                            >
                                <div className="p-2 bg-green-100 rounded-full">
                                    <FileCheck className="w-6 h-6" />
                                </div>
                                <div className="text-center">
                                    <p className="font-medium text-sm">{config.tradeLicense.name}</p>
                                    <p className="text-xs opacity-75">Click to change file</p>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="upload-prompt"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex flex-col items-center gap-2 text-muted-foreground"
                            >
                                <div className="p-2 bg-secondary rounded-full group-hover:scale-110 transition-transform">
                                    <FileUp className="w-6 h-6" />
                                </div>
                                <div className="text-center">
                                    <p className="font-medium text-sm">Click to upload Trade License</p>
                                    <p className="text-xs opacity-75">Required for verification</p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </Label>
            </div>
        </section>
    );
}
