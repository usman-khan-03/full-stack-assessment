"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { useUser } from "@/lib/useUser";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import ListingCard from "./ListingCard";
import LoadingSpinner from "@/components/ui/loading-spinner";

export default function Dashboard() {
  const { user, loading } = useUser();
  const [listings, setListings] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    if (loading) return;

    if (!user) {
      setError("Please log in to view your listings");
      setInitialLoading(false);
      return;
    }

    const q = query(collection(db, "products"), where("owner", "==", user.uid));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const items = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setListings(items);
        setError("");
        setInitialLoading(false);
      },
      (err) => {
        console.error("Firestore error:", err);
        setError("Failed to load listings");
        setInitialLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user, loading]);

  if (loading || initialLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <LoadingSpinner size="lg" />
        <p className="text-gray-600">Loading your listings...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="text-red-500 text-center">
          <div className="text-4xl mb-4">⚠️</div>
          <p className="text-lg font-medium">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {listings.filter(
        (item) =>
          item.image_url &&
          typeof item.image_url === "string" &&
          item.image_url.trim() !== ""
      ).length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
          <div className="text-gray-400 text-center">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              No listings yet
            </h3>
            <p className="text-gray-600">
              Upload your first product to get started!
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings
            .filter(
              (item) =>
                item.image_url &&
                typeof item.image_url === "string" &&
                item.image_url.trim() !== ""
            )
            .map((item) => (
              <ListingCard key={item.id} {...item} />
            ))}
        </div>
      )}
    </div>
  );
}
