import { initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import * as dotenv from "dotenv";
import serviceAccount from "./serviceAccountKey.json";

// Load environment variables (optional)
dotenv.config();

initializeApp({
  credential: cert(serviceAccount as any),
});

const adminUID = process.env.NEXT_PUBLIC_ADMIN_UID!; // Get from Firebase Auth user list

getAuth()
  .setCustomUserClaims(adminUID, { admin: true })
  .then(() => {
    console.log(`✅ Custom claim 'admin: true' set for user: ${adminUID}`);
    process.exit(0);
  })
  .catch((err) => {
    console.error("❌ Error setting custom claim:", err);
    process.exit(1);
  });