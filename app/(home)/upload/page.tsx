import FileUploader from "@/components/file-uploader";
import { ExternalLink, FolderOpen, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function UploadPage() {
    return (
        <main className="px-20 py-8">
            {/* Back Link - Full Width */}
            <Link
                href="/"
                className="inline-flex items-center gap-2 text-sm text-fd-muted-foreground hover:text-fd-foreground mb-8 transition-colors"
            >
                <ArrowLeft className="size-4" />
                Back to Home
            </Link>

            {/* Centered Content */}
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-semibold mb-3">Upload Your Notes</h1>
                    <p className="text-fd-muted-foreground">
                        Share your notes, resources, or study materials with fellow students.
                    </p>
                </div>

                {/* Upload Area */}
                <FileUploader />

                {/* View Folder Card */}
                <div className="mt-8 p-5 rounded-xl border bg-fd-card">
                    <div className="flex items-start gap-4">
                        <div className="rounded-lg border bg-fd-background p-2.5">
                            <FolderOpen className="size-5 text-fd-muted-foreground" />
                        </div>
                        <div className="flex-1">
                            <p className="font-medium mb-1">View Uploaded Files</p>
                            <p className="text-sm text-fd-muted-foreground mb-3">
                                Browse all contributions from the community.
                            </p>
                            <Link
                                href="https://drive.google.com/drive/folders/18lvCelrTUnlEdAvUNhU2FO4L62dnYcQf?usp=sharing"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-sm font-medium text-fd-primary hover:underline"
                            >
                                Open Drive Folder
                                <ExternalLink className="size-3.5" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
