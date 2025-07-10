import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            <span className="bg-gradient-to-r from-indigo-500 to-sky-400 bg-clip-text text-transparent">ai</span>
            <span className="text-gray-900">sle</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Upload product images and let AI generate titles, descriptions, and
            keywords automatically.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/auth/register">
              <Button size="lg" className="text-lg px-8 py-3">
                Get Started
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button variant="outline" size="lg" className="text-lg px-8 py-3">
                Sign In
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-3xl mb-4">📸</div>
              <h3 className="text-xl font-semibold mb-2">Upload Images</h3>
              <p className="text-gray-600">
                Simply upload your product images and our AI will analyze them
                automatically.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-3xl mb-4">🤖</div>
              <h3 className="text-xl font-semibold mb-2">AI Processing</h3>
              <p className="text-gray-600">
                Advanced AI generates compelling titles, descriptions, and SEO
                keywords.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-3xl mb-4">📊</div>
              <h3 className="text-xl font-semibold mb-2">Manage Listings</h3>
              <p className="text-gray-600">
                View and manage all your product listings in one dashboard.
              </p>
            </div>
          </div>

          <div className="mt-16 text-center">
            <h2 className="text-2xl font-semibold mb-4">
              Built with Modern Tech
            </h2>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
              <span className="bg-blue-100 px-3 py-1 rounded-full">
                Next.js 15
              </span>
              <span className="bg-green-100 px-3 py-1 rounded-full">
                FastAPI
              </span>
              <span className="bg-orange-100 px-3 py-1 rounded-full">
                Firebase
              </span>
              <span className="bg-purple-100 px-3 py-1 rounded-full">
                OpenAI
              </span>
              <span className="bg-gray-100 px-3 py-1 rounded-full">
                Tailwind CSS
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
