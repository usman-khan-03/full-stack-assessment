import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle } from "lucide-react";

interface AdminReviewCardProps {
  id: string;
  image_url: string;
  title: string;
  description: string;
  status: string;
  onApprove: () => void;
  onReject: () => void;
}

export default function AdminReviewCard({
  image_url,
  title,
  description,
  status,
  onApprove,
  onReject,
}: AdminReviewCardProps) {
  const [imageError, setImageError] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAction = async (action: () => void) => {
    setIsProcessing(true);
    try {
      await action();
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200 hover:border-blue-300">
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
      <p className="text-sm text-gray-600 mb-4 line-clamp-3">{description}</p>

      <div className="flex gap-3">
        <Button
          onClick={() => handleAction(onApprove)}
          disabled={isProcessing}
          className="flex-1 bg-green-600 hover:bg-green-700 text-white"
        >
          <CheckCircle className="w-4 h-4 mr-2" />
          Approve
        </Button>
        <Button
          onClick={() => handleAction(onReject)}
          disabled={isProcessing}
          variant="destructive"
          className="flex-1"
        >
          <XCircle className="w-4 h-4 mr-2" />
          Reject
        </Button>
      </div>
    </div>
  );
}
