// ============================================================
// Sync Engine — Firebase Firestore + Storage
// ============================================================
import {
  doc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import {
  ref,
  uploadString,
  getDownloadURL,
} from "firebase/storage";
import { firestoreDb, firebaseStorage } from "../firebase/config";
import {
  getUnsyncedSurveys,
  markSynced,
  updateSyncError,
} from "./dexie";
import type { SurveyRecord, Building, NeighbourhoodPhotos } from "../types/survey";

// ------------------------------------------------------------------
// Upload a single base64 image to Firebase Storage
// Returns public download URL, or null on failure
// ------------------------------------------------------------------
async function uploadPhoto(
  base64: string,
  path: string
): Promise<string | null> {
  if (!base64 || base64.startsWith("http")) return base64; // already a URL
  try {
    const storageRef = ref(firebaseStorage, path);
    await uploadString(storageRef, base64, "data_url");
    return await getDownloadURL(storageRef);
  } catch (err) {
    console.error("Photo upload failed:", path, err);
    return null;
  }
}

// ------------------------------------------------------------------
// Process a single survey — upload photos, then write to Firestore
// ------------------------------------------------------------------
async function syncRecord(record: SurveyRecord): Promise<void> {
  const id = record.id!;
  const docId = record.firebaseId || `survey_${id}_${record.createdAt}`;

  // --- Upload building photos ---
  const buildings = await Promise.all(
    record.buildings.map(async (b: Building) => {
      if (!b.exists) return b;
      const basePath = `surveys/${docId}/building_${b.id}`;
      const front = b.photos.front
        ? await uploadPhoto(b.photos.front, `${basePath}/front.jpg`)
        : undefined;
      const interior = b.photos.interior
        ? await uploadPhoto(b.photos.interior, `${basePath}/interior.jpg`)
        : undefined;
      return { ...b, photos: { front, interior } };
    })
  );

  // --- Upload neighbourhood photos ---
  const np = record.neighbourhoodPhotos as NeighbourhoodPhotos;
  const npBase = `surveys/${docId}/neighbourhood`;
  const neighbourhoodPhotos: NeighbourhoodPhotos = {
    general1: np.general1
      ? (await uploadPhoto(np.general1, `${npBase}/general1.jpg`)) ?? undefined
      : undefined,
    general2: np.general2
      ? (await uploadPhoto(np.general2, `${npBase}/general2.jpg`)) ?? undefined
      : undefined,
    accessRoad: np.accessRoad
      ? (await uploadPhoto(np.accessRoad, `${npBase}/accessRoad.jpg`)) ?? undefined
      : undefined,
    surroundings: np.surroundings
      ? (await uploadPhoto(np.surroundings, `${npBase}/surroundings.jpg`)) ?? undefined
      : undefined,
  };

  // --- Build Firestore payload (omit IndexedDB-only fields) ---
  const { id: _localId, syncError: _err, ...payload } = record;
  const firestorePayload = {
    ...payload,
    buildings,
    neighbourhoodPhotos,
    firebaseId: docId,
    serverUpdatedAt: serverTimestamp(),
  };

  // --- Write to Firestore ---
  await setDoc(doc(firestoreDb, "surveys", docId), firestorePayload);

  // --- Mark synced in local IndexedDB ---
  await markSynced(id, docId);
}

// ------------------------------------------------------------------
// Main sync function — called on online event or manual trigger
// ------------------------------------------------------------------
export async function syncPendingSurveys(
  onProgress?: (done: number, total: number) => void
): Promise<{ success: number; failed: number }> {
  const pending = await getUnsyncedSurveys();
  let success = 0;
  let failed = 0;

  for (let i = 0; i < pending.length; i++) {
    const record = pending[i];
    try {
      await syncRecord(record);
      success++;
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      await updateSyncError(record.id!, message);
      failed++;
    }
    onProgress?.(i + 1, pending.length);
  }

  return { success, failed };
}
