"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { useUser } from "@/lib/useUser";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import ListingCard from "./ListingCard";

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
        const items = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
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

  if (initialLoading) return <p>Loading...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="grid gap-4">
      {listings.length === 0 ? (
        <p>No listings yet.</p>
      ) : (
        listings.map((item) => <ListingCard key={item.id} {...item} />)
      )}
    </div>
  );
}