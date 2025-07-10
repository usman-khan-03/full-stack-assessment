"use client";

import Link from "next/link";
import { useUser } from "@/lib/useUser";
import { logout } from "@/lib/auth";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const { user, loading } = useUser();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold">
              Product AI
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {!loading && (
              <>
                {user ? (
                  <>
                    <Link href="/upload">
                      <Button variant="outline">Upload</Button>
                    </Link>
                    <Link href="/dashboard">
                      <Button variant="outline">Dashboard</Button>
                    </Link>
                    <Button onClick={handleLogout} variant="ghost">
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Link href="/auth/login">
                      <Button variant="outline">Login</Button>
                    </Link>
                    <Link href="/auth/register">
                      <Button>Register</Button>
                    </Link>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
