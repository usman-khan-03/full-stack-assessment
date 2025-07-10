"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { storage } from "@/lib/firebase";
import { useUser } from "@/lib/useUser";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import { useIsClient } from "@/lib/hooks/useIsClient";

export default function UploadForm() {
  const isClient = useIsClient();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");
  const { user, loading } = useUser();

  if (!isClient) {
    return null;
  } // or a loader

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!file || loading) return;
    setUploading(true);
    setSuccessMessage("");
    setError("");

    try {
      if (!user) throw new Error("Please log in to upload products");

      const fileId = uuidv4();
      const fileRef = ref(storage, `products/${fileId}`);
      await uploadBytes(fileRef, file);
      const downloadURL = await getDownloadURL(fileRef);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/products`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.NEXT_PUBLIC_BACKEND_API_KEY!,
          },
          body: JSON.stringify({
            image_url: downloadURL,
            owner: user.uid,
            id: fileId,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.detail || `Error: ${result.message}`);
      }

      setSuccessMessage("Listing created successfully!");
      setFile(null);
    } catch (err: any) {
      console.error("Upload error:", err);
      setError(err.message || "Failed to upload");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Input type="file" accept="image/*" onChange={handleFileChange} />
      <Button onClick={handleUpload} disabled={uploading || !file || loading}>
        {uploading ? "Uploading..." : "Upload"}
      </Button>

      {successMessage && <p className="text-green-600">{successMessage}</p>}
      {error && <p className="text-red-600">{error}</p>}
    </div>
  );
}
