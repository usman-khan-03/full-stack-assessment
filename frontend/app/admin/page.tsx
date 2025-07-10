import AdminDashboard from "@/components/AdminDashboard";

export default function AdminPage() {
  return (
    <main className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Admin Panel - Review Listings</h1>
      <AdminDashboard />
    </main>
  );
}