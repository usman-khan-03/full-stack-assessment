"use client";

import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/app/context/AuthContext";
import AdminReviewCard from "@/components/AdminReviewCard";
import LoadingSpinner from "@/components/ui/loading-spinner";
import ProtectedRoute from "@/components/ProtectedRoute";
import Toast from "@/components/ui/toast";

export default function AdminPage() {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  useEffect(() => {
    if (!isAdmin || authLoading) return;

    const q = query(
      collection(db, "products"),
      where("status", "==", "pending")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setListings(items);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [isAdmin, authLoading]);

  const handleApprove = async (id: string) => {
    try {
      await updateDoc(doc(db, "products", id), { status: "approved" });
      setToast({ message: "Listing approved successfully!", type: "success" });
    } catch (error) {
      setToast({ message: "Failed to approve listing", type: "error" });
    }
  };

  const handleReject = async (id: string) => {
    try {
      await updateDoc(doc(db, "products", id), { status: "rejected" });
      setToast({ message: "Listing rejected successfully!", type: "success" });
    } catch (error) {
      setToast({ message: "Failed to reject listing", type: "error" });
    }
  };

  if (authLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <LoadingSpinner size="lg" />
        <p className="text-gray-600">Checking authentication...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="text-red-500 text-center">
          <div className="text-4xl mb-4">🚫</div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">
            Access Denied
          </h3>
          <p className="text-gray-600">
            You are not authorized to view this page.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <LoadingSpinner size="lg" />
        <p className="text-gray-600">Loading pending listings...</p>
      </div>
    );
  }

  return (
    <ProtectedRoute requireAdmin={true}>
      <main className="p-4 max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Review Listings</h1>
          <div className="text-sm text-gray-600">
            {listings.length} pending{" "}
            {listings.length === 1 ? "listing" : "listings"}
          </div>
        </div>

        {listings.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
            <div className="text-gray-400 text-center">
              <div className="text-6xl mb-4">✅</div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                All caught up!
              </h3>
              <p className="text-gray-600">No pending listings to review.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((item) => (
              <AdminReviewCard
                key={item.id}
                {...item}
                onApprove={() => handleApprove(item.id)}
                onReject={() => handleReject(item.id)}
              />
            ))}
          </div>
        )}

        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </main>
    </ProtectedRoute>
  );
}
