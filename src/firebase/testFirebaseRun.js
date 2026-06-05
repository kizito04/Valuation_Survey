// testFirebaseRun.js
// Simple Node script to verify Firebase connectivity using env vars
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";

// Load env variables (Vite uses import.meta.env, but for Node we use process.env)
const {
  VITE_FIREBASE_API_KEY,
  VITE_FIREBASE_AUTH_DOMAIN,
  VITE_FIREBASE_PROJECT_ID,
  VITE_FIREBASE_STORAGE_BUCKET,
  VITE_FIREBASE_MESSAGING_SENDER_ID,
  VITE_FIREBASE_APP_ID,
} = process.env;

if (!VITE_FIREBASE_API_KEY) {
  console.error("Firebase environment variables are not set. Ensure .env is loaded.");
  process.exit(1);
}

const firebaseConfig = {
  apiKey: VITE_FIREBASE_API_KEY,
  authDomain: VITE_FIREBASE_AUTH_DOMAIN,
  projectId: VITE_FIREBASE_PROJECT_ID,
  storageBucket: VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

(async () => {
  console.log("Testing Firebase connection...");
  try {
    const testDocRef = doc(db, "test_collection", "test_doc");
    await setDoc(testDocRef, { timestamp: Date.now() });
    const snap = await getDoc(testDocRef);
    console.log("Read back:", snap.data());
    console.log("Firebase connection successful.");
  } catch (e) {
    console.error("Firebase connection failed:", e);
  }
})();
