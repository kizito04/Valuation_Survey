// ============================================================
// Dexie (IndexedDB) Database Schema & Helpers
// ============================================================
import Dexie, { type Table } from "dexie";
import type { SurveyRecord } from "../types/survey";

export class SurveyDatabase extends Dexie {
  surveys!: Table<SurveyRecord, number>;

  constructor() {
    super("ValuationSurveyDB");

    this.version(1).stores({
      surveys: "++id, createdAt, synced",
    });
  }
}

export const surveyDb = new SurveyDatabase();

// ------------------------------------------------------------
// Helper: Save or update a survey record
// ------------------------------------------------------------
export async function saveSurvey(
  record: Omit<SurveyRecord, "id">
): Promise<number> {
  return surveyDb.surveys.add(record as SurveyRecord);
}

export async function updateSurvey(
  id: number,
  changes: Partial<SurveyRecord>
): Promise<void> {
  await surveyDb.surveys.update(id, changes);
}

// ------------------------------------------------------------
// Helper: Read
// ------------------------------------------------------------
export async function getAllSurveys(): Promise<SurveyRecord[]> {
  return surveyDb.surveys.orderBy("createdAt").reverse().toArray();
}

export async function getUnsyncedSurveys(): Promise<SurveyRecord[]> {
  return surveyDb.surveys.where("synced").equals(0).toArray();
}

// ------------------------------------------------------------
// Helper: Sync status updates
// ------------------------------------------------------------
export async function markSynced(
  id: number,
  firebaseId: string
): Promise<void> {
  await surveyDb.surveys.update(id, {
    synced: true,
    firebaseId,
    syncError: undefined,
  });
}

export async function updateSyncError(
  id: number,
  error: string
): Promise<void> {
  await surveyDb.surveys.update(id, { syncError: error, synced: false });
}

// ------------------------------------------------------------
// Helper: Delete
// ------------------------------------------------------------
export async function deleteSurvey(id: number): Promise<void> {
  await surveyDb.surveys.delete(id);
}
