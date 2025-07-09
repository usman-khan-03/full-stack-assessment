from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv

# Load env vars from .env
load_dotenv()

app = FastAPI()

# Enable CORS for local dev and Vercel frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",     # local frontend
        "https://boxsy-frontend.vercel.app"  # live frontend
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Import and include your route modules (we’ll create these next)
from app.routes import products, admin

app.include_router(products.router, prefix="/products")
app.include_router(admin.router, prefix="/admin")

# Health check
@app.get("/api/health")
def health_check():
    return {"status": "ok"}
