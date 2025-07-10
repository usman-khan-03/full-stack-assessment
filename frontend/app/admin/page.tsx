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

export default function AdminPage() {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

  if (authLoading) return <p>Loading auth...</p>;
  if (!isAdmin)
    return (
      <p className="text-red-600">You are not authorized to view this page.</p>
    );
  if (loading) return <p>Loading listings...</p>;

  return (
    <main className="p-4 max-w-3xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold mb-4">Review Listings</h1>
      {listings.length === 0 ? (
        <p>No pending listings.</p>
      ) : (
        listings.map((item) => (
          <AdminReviewCard
            key={item.id}
            {...item}
            onApprove={() =>
              updateDoc(doc(db, "products", item.id), { status: "approved" })
            }
            onReject={() =>
              updateDoc(doc(db, "products", item.id), { status: "rejected" })
            }
          />
        ))
      )}
    </main>
  );
}
