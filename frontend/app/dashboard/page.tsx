import Dashboard from "@/components/Dashboard";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <main className="p-4 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Your Listings</h1>
        <Dashboard />
      </main>
    </ProtectedRoute>
  );
}
