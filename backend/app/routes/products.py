from fastapi import APIRouter, Request, Header, HTTPException
from app.services import firebase_service, ai_service
import os
import uuid

router = APIRouter()

@router.post("/")
async def create_product(req: Request, x_api_key: str = Header(None)):
    # Security: check API key
    if x_api_key != os.getenv("BACKEND_API_KEY"):
        raise HTTPException(status_code=401, detail="Unauthorized")

    # Parse request JSON
    body = await req.json()
    image_url = body.get("image_url")
    owner = body.get("owner")  # Firebase UID
    listing_id = body.get("id") or str(uuid.uuid4())

    if not image_url or not owner:
        raise HTTPException(status_code=400, detail="Missing required fields")

    # Call OpenAI Vision API
    metadata = ai_service.generate_metadata(image_url)

    print("[DEBUG] Metadata generated:", metadata)

    # Build full product object
    listing_data = {
        "id": listing_id,
        "owner": owner,
        "image_url": image_url,
        "status": "pending",
        **metadata,
    }

    product = {
        "id": "test123",  # Replace this with UUID later
        "owner": "test-user-id",  # Replace with real user ID from auth
        "image_url": image_url,
        "status": "pending",
        **metadata
    }

    firebase_service.save_product(product)

    return {"success": True, "listing": listing_data}
