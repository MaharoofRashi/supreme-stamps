import { Label } from "@/components/ui/label";
import { FileUp, FileCheck, Loader2, X } from "lucide-react"; // Added Loader2, X
import { StampConfig } from "@/types/stamp";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useUploadThing } from "@/lib/uploadthing"; // Import hook
// Removed missing toast hook

interface DocumentUploadProps {
    config: StampConfig;
    setConfig: (config: StampConfig) => void;
}

export function DocumentUpload({ config, setConfig }: DocumentUploadProps) {
    // Initialize UploadThing hook
    const { startUpload, isUploading } = useUploadThing("tradeLicenseUploader", {
        onClientUploadComplete: (res) => {
            if (res && res[0]) {
                setConfig({
                    ...config,
                    tradeLicenseUrl: res[0].url,
                    // keep the File object for display name if needed, or rely on URL
                });
                console.log("Upload Completed", res[0].url);
            }
        },
        onUploadError: (error: Error) => {
            console.error("Upload failed", error);
            alert("Upload failed: " + error.message); // Simple fallback
        },
    });

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            // Optimistically set file for UI
            setConfig({ ...config, tradeLicense: file });

            // Trigger upload immediately
            await startUpload([file]);
        }
    };

    const clearFile = (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent label click
        e.stopPropagation();
        setConfig({ ...config, tradeLicense: null, tradeLicenseUrl: undefined });
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
                    disabled={isUploading}
                />
                <Label
                    htmlFor="trade-license"
                    className={cn(
                        "flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 relative overflow-hidden",
                        config.tradeLicenseUrl
                            ? "border-green-500/50 bg-green-500/5"
                            : "border-muted-foreground/25 hover:border-primary/50 hover:bg-accent/40"
                    )}
                >
                    {/* Progress Bar (Indeterminate for now) */}
                    {isUploading && (
                        <div className="absolute inset-x-0 top-0 h-1 bg-primary/20 overflow-hidden">
                            <motion.div
                                className="h-full bg-primary"
                                initial={{ x: "-100%" }}
                                animate={{ x: "100%" }}
                                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                            />
                        </div>
                    )}

                    <AnimatePresence mode="wait">
                        {config.tradeLicense ? (
                            <motion.div
                                key="file-uploaded"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex flex-col items-center gap-2 text-green-700 w-full px-4"
                            >
                                <div className="flex items-center justify-between w-full max-w-xs p-2 bg-white/60 backdrop-blur-sm rounded-lg border shadow-sm">
                                    <div className="flex items-center gap-3 overflow-hidden">
                                        <div className="p-2 bg-green-100 rounded-full shrink-0">
                                            {isUploading ? <Loader2 className="w-5 h-5 animate-spin text-green-600" /> : <FileCheck className="w-5 h-5 text-green-600" />}
                                        </div>
                                        <div className="flex flex-col min-w-0">
                                            <p className="font-medium text-sm truncate max-w-[150px]">{config.tradeLicense.name}</p>
                                            <p className="text-xs opacity-75 text-muted-foreground">
                                                {isUploading ? "Uploading..." : "Upload Complete"}
                                            </p>
                                        </div>
                                    </div>

                                    {!isUploading && (
                                        <button onClick={clearFile} className="p-1 hover:bg-red-100 rounded-full text-muted-foreground hover:text-red-500 transition-colors">
                                            <X className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="upload-prompt"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex flex-col items-center gap-2 text-muted-foreground"
                            >
                                <div className="p-2 bg-secondary rounded-full group-hover:scale-110 transition-transform shadow-sm">
                                    <FileUp className="w-6 h-6" />
                                </div>
                                <div className="text-center">
                                    <p className="font-medium text-sm">Click to upload Trade License</p>
                                    <p className="text-xs opacity-75">PDF or Image (Max 4MB)</p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </Label>
            </div>
        </section>
    );
}

