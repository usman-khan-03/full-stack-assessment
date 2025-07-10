"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, query, where, onSnapshot, updateDoc, doc } from "firebase/firestore";
import AdminReviewCard from "./AdminReviewCard";

export default function AdminDashboard() {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "products"), where("status", "==", "pending"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setListings(items);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleAction = async (id: string, status: "approved" | "rejected") => {
    const docRef = doc(db, "products", id);
    await updateDoc(docRef, { status });
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="grid gap-4">
      {listings.length === 0 ? (
        <p>No pending listings.</p>
      ) : (
        listings.map((item) => (
          <AdminReviewCard
            key={item.id}
            {...item}
            onApprove={() => handleAction(item.id, "approved")}
            onReject={() => handleAction(item.id, "rejected")}
          />
        ))
      )}
    </div>
  );
}