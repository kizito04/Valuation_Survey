// ============================================================
// Firebase Configuration
// Replace placeholder values with your actual Firebase project config.
// Get them from: Firebase Console → Project Settings → Your Apps → Web App
// ============================================================
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firestore — primary remote database for survey records
export const firestoreDb = getFirestore(app);

// Firebase Storage — for uploading photo blobs/base64 images
export const firebaseStorage = getStorage(app);

export default app;
