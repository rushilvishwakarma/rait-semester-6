"use server";

export async function uploadToDrive(formData: FormData) {
    const file = formData.get("file") as File;
    if (!file) return { status: "error", message: "No file provided" };

    try {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const base64 = buffer.toString("base64");

        // Google Apps Script Web App URL
        const scriptUrl = "https://script.google.com/macros/s/AKfycbzUJHO6dGATJkKP-ct9qzCQ9EAIn2ry0-Z7vuiK2vZZBFxLr4FLHmykG7EecJ5IHGt2Eg/exec";

        const response = await fetch(scriptUrl, {
            method: "POST",
            body: JSON.stringify({
                base64: base64,
                filename: file.name,
                mimeType: file.type,
            }),
        });

        return await response.json();
    } catch (error) {
        console.error("Upload error:", error);
        return { status: "error", message: "Server connection failed" };
    }
}
