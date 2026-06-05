// testFirebase.ts
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import { firebaseStorage, firestoreDb } from "./config"; // assuming config exports these

(async () => {
  console.log("Testing Firebase connection...");
  try {
    // Write a test document
    const testDocRef = doc(firestoreDb, "test_collection", "test_doc");
    await setDoc(testDocRef, { timestamp: Date.now() });
    const snap = await getDoc(testDocRef);
    console.log("Read back:", snap.data());
    console.log("Firebase connection successful.");
  } catch (e) {
    console.error("Firebase connection failed:", e);
  }
})();
