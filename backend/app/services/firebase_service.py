import os
import uuid
import firebase_admin
from firebase_admin import credentials, firestore, storage, auth

# Load env vars
from dotenv import load_dotenv
load_dotenv()

# Initialize Firebase Admin SDK
# Handle both local development and deployment
cred_path = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")
if cred_path and os.path.exists(cred_path):
    # Local development with service account file
    cred = credentials.Certificate(cred_path)
else:
    # Deployment with environment variables
    private_key = os.getenv("FIREBASE_PRIVATE_KEY")
    if private_key:
        private_key = private_key.replace("\\n", "\n")
    
    cred = credentials.Certificate({
        "type": "service_account",
        "project_id": os.getenv("FIREBASE_PROJECT_ID"),
        "private_key_id": os.getenv("FIREBASE_PRIVATE_KEY_ID"),
        "private_key": private_key,
        "client_email": os.getenv("FIREBASE_CLIENT_EMAIL"),
        "client_id": os.getenv("FIREBASE_CLIENT_ID"),
        "auth_uri": "https://accounts.google.com/o/oauth2/auth",
        "token_uri": "https://oauth2.googleapis.com/token",
        "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
        "client_x509_cert_url": os.getenv("FIREBASE_CLIENT_CERT_URL")
    })

firebase_admin.initialize_app(cred, {
    "storageBucket": os.getenv("FIREBASE_STORAGE_BUCKET")
})

db = firestore.client()
bucket = storage.bucket()

def save_listing_to_firestore(data: dict):
    """Save a product listing to Firestore under 'listings/{id}'"""
    listing_id = data.get("id", str(uuid.uuid4()))
    db.collection("listings").document(listing_id).set(data)
    return listing_id

def get_listings_by_user(user_id: str):
    """Fetch all listings belonging to a given user"""
    return db.collection("listings").where("owner", "==", user_id).stream()

def approve_listing(listing_id: str):
    """Mark a listing as approved"""
    db.collection("listings").document(listing_id).update({
        "status": "approved"
    })

def reject_listing(listing_id: str):
    """Mark a listing as rejected"""
    db.collection("listings").document(listing_id).update({
        "status": "rejected"
    })

def upload_image_to_storage(file_data: bytes, user_id: str, filename: str):
    """Upload raw image bytes to Firebase Storage under user-specific path"""
    blob_path = f"{user_id}/{filename}"
    blob = bucket.blob(blob_path)
    blob.upload_from_string(file_data, content_type="image/jpeg")
    return blob.public_url

def save_product(product: dict):
    doc_ref = db.collection("products").document(product["id"])
    doc_ref.set(product)
    print("[Firestore] Product saved:", product["id"])