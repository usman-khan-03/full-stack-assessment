interface ListingProps {
    id: string;
    image_url: string;
    title: string;
    description: string;
    status: string;
  }
  
  export default function ListingCard({ image_url, title, description, status }: ListingProps) {
    return (
      <div className="border rounded-xl p-4 shadow">
        <img src={image_url} alt={title} className="w-full h-48 object-cover rounded-md" />
        <h2 className="text-lg font-bold mt-2">{title}</h2>
        <p className="text-sm text-muted-foreground">{description}</p>
        <p className="text-xs mt-2 font-medium">Status: {status}</p>
      </div>
    );
  }