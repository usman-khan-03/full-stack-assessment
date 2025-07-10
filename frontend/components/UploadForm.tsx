"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { storage } from "@/lib/firebase";
import { useUser } from "@/lib/useUser";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import { useIsClient } from "@/lib/hooks/useIsClient";
import LoadingSpinner from "@/components/ui/loading-spinner";
import Toast from "@/components/ui/toast";
import { Upload, CheckCircle } from "lucide-react";

export default function UploadForm() {
  const isClient = useIsClient();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const { user, loading } = useUser();

  if (!isClient) {
    return null;
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!file || loading) return;
    setUploading(true);

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

      setToast({ message: "Product uploaded successfully!", type: "success" });
      setFile(null);
    } catch (err: any) {
      console.error("Upload error:", err);
      setToast({ message: err.message || "Failed to upload", type: "error" });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Upload Product
        </h2>
        <p className="text-gray-600">
          Upload an image and let AI generate the details
        </p>
      </div>

      <div className="space-y-4">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
          <Input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            id="file-upload"
          />
          <label htmlFor="file-upload" className="cursor-pointer">
            <div className="space-y-2">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <div className="text-sm text-gray-600">
                <span className="font-medium text-blue-600 hover:text-blue-500">
                  Click to upload
                </span>{" "}
                or drag and drop
              </div>
              <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
            </div>
          </label>
        </div>

        {file && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium text-green-800">
                {file.name} selected
              </span>
            </div>
          </div>
        )}

        <Button
          onClick={handleUpload}
          disabled={uploading || !file || loading}
          className="w-full"
          size="lg"
        >
          {uploading ? (
            <>
              <LoadingSpinner size="sm" className="mr-2" />
              Processing with AI...
            </>
          ) : (
            "Upload & Generate"
          )}
        </Button>
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
