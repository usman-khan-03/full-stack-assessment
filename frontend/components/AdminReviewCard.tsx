import { Button } from "@/components/ui/button";

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
  return (
    <div className="border rounded-xl p-4 shadow">
      <img src={image_url} alt={title} className="w-full h-48 object-cover rounded-md" />
      <h2 className="text-lg font-bold mt-2">{title}</h2>
      <p className="text-sm text-muted-foreground">{description}</p>
      <p className="text-xs mt-2 font-medium">Status: {status}</p>

      <div className="flex gap-2 mt-4">
        <Button onClick={onApprove} variant="default">
          Approve
        </Button>
        <Button onClick={onReject} variant="destructive">
          Reject
        </Button>
      </div>
    </div>
  );
}