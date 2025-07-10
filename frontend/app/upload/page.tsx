import UploadForm from "@/components/UploadForm";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function UploadPage() {
  return (
    <ProtectedRoute>
      <main className="p-4 max-w-2xl mx-auto">
        <UploadForm />
      </main>
    </ProtectedRoute>
  );
}
