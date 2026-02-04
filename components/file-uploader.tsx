"use client";
import { useState, useRef } from "react";
import { uploadToDrive } from "@/app/actions";
import { Upload, CheckCircle, XCircle, Loader2 } from "lucide-react";

export default function FileUploader() {
    const [isDragging, setIsDragging] = useState(false);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<{ status: string; message?: string } | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const startUpload = async (file: File) => {
        setLoading(true);
        setResult(null);
        const formData = new FormData();
        formData.append("file", file);

        const response = await uploadToDrive(formData);
        setLoading(false);
        setResult(response);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) startUpload(e.target.files[0]);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files?.[0]) startUpload(e.dataTransfer.files[0]);
    };

    return (
        <div className="w-full">
            <div
                onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-12 flex flex-col items-center justify-center cursor-pointer transition-all
          ${isDragging ? "border-blue-500 bg-blue-500/10" : "border-fd-border hover:border-fd-primary bg-fd-card"}
          ${loading ? "opacity-50 pointer-events-none" : "opacity-100"}`}
            >
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                />

                <div className="mb-4">
                    {loading ? (
                        <Loader2 className="size-12 text-fd-muted-foreground animate-spin" />
                    ) : (
                        <Upload className="size-12 text-fd-muted-foreground" />
                    )}
                </div>
                <p className="text-lg font-medium text-fd-foreground">
                    {loading ? "Uploading to Drive..." : "Drop file here or click to upload"}
                </p>
                <p className="text-sm text-fd-muted-foreground mt-2">
                    Uploads go to the shared folder
                </p>
            </div>

            {result && (
                <div
                    className={`mt-4 p-4 rounded-lg flex items-center gap-3 ${result.status === "success"
                        ? "bg-green-500/10 text-green-600 dark:text-green-400"
                        : "bg-red-500/10 text-red-600 dark:text-red-400"
                        }`}
                >
                    {result.status === "success" ? (
                        <CheckCircle className="size-5" />
                    ) : (
                        <XCircle className="size-5" />
                    )}
                    <span>
                        {result.status === "success"
                            ? "File uploaded successfully!"
                            : result.message || "Upload failed"}
                    </span>
                </div>
            )}
        </div>
    );
}
