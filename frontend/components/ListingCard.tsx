import { useState } from "react";

interface ListingProps {
  id: string;
  image_url: string;
  title: string;
  description: string;
  status: string;
}

export default function ListingCard({
  image_url,
  title,
  description,
  status,
}: ListingProps) {
  const [imageError, setImageError] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800 border-green-200";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200 hover:border-gray-300">
      <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 mb-4">
        {!imageError ? (
          <img
            src={image_url}
            alt={title}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500">
            <div className="text-center">
              <div className="text-4xl mb-2">📷</div>
              <p className="text-sm">Image not available</p>
            </div>
          </div>
        )}
      </div>

      <h2 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
        {title}
      </h2>
      <p className="text-sm text-gray-600 mb-3 line-clamp-3">{description}</p>

      <div
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(
          status
        )}`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </div>
    </div>
  );
}
