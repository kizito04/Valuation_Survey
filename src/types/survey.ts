// ============================================================
// SGR Valuation Survey — TypeScript Data Models
// ============================================================

export type Gender = "Male" | "Female" | "Other";
export type LandSizeUnit = "Acres" | "Hectares" | "Square metres" | "Decimal";
export type CropCondition = "Good" | "Fair" | "Poor";
export type BuildingCondition = "Good" | "Fair" | "Poor" | "Dilapidated";
export type SyncStatusType = "pending" | "syncing" | "synced" | "error";

// ------------------------------------------------------------
// Building
// ------------------------------------------------------------
export interface BuildingPhoto {
  front?: string;      // base64 (offline) or Firebase Storage URL (after sync)
  interior?: string;   // base64 (offline) or Firebase Storage URL (after sync)
}

export interface Building {
  id: number;          // 1–4
  exists: boolean;     // if false, UI skips fields
  type: string;
  area: number;
  roof: string;
  walls: string;
  floor: string;
  windows: string;
  doors: string;
  accommodation: string;
  condition: BuildingCondition | "";
  photos: BuildingPhoto;
}

// ------------------------------------------------------------
// Crops
// ------------------------------------------------------------
export interface CropRow {
  id: string;          // nanoid
  name: string;
  quantity: number;
  unit: string;
  condition: CropCondition | "";
}

// ------------------------------------------------------------
// Neighbourhood Photos
// ------------------------------------------------------------
export interface NeighbourhoodPhotos {
  general1?: string;
  general2?: string;
  accessRoad?: string;
  surroundings?: string;
}

// ------------------------------------------------------------
// GPS
// ------------------------------------------------------------
export interface GPSPosition {
  latitude: number | null;
  longitude: number | null;
  accuracy: number | null;
  capturedAt: number | null;  // Unix timestamp ms
}

// ------------------------------------------------------------
// Services
// ------------------------------------------------------------
export interface ServiceFlags {
  electricity: boolean;
  pipedWater: boolean;
  telephone: boolean;
  publicWell: boolean;
}

// ------------------------------------------------------------
// Main Survey Record
// ------------------------------------------------------------
export interface SurveyRecord {
  id?: number;                        // auto-incremented by Dexie
  firebaseId?: string;                // Firestore document ID after sync
  createdAt: number;                  // Unix ms — used for sync ordering
  updatedAt: number;                  // Unix ms
  synced: boolean;
  syncError?: string;

  // --- PAP Identification ---
  serialNo: string;
  district: string;
  subCounty: string;
  parish: string;
  village: string;
  papNames: string;
  gender: Gender | "";
  nationalId: string;
  chainage: string;
  plotBlock: string;
  landTenure: string;

  // --- Land & Access ---
  landSize: number | "";
  landSizeUnit: LandSizeUnit | "";
  roadAccess: boolean;

  // --- GPS ---
  gps: GPSPosition;

  // --- Buildings (always 4, UI shows only if exists=true) ---
  buildings: [Building, Building, Building, Building];

  // --- Other Improvements ---
  otherImprovements: string;

  // --- Services ---
  services: ServiceFlags;

  // --- Crops ---
  crops: CropRow[];

  // --- Neighbourhood Photos ---
  neighbourhoodPhotos: NeighbourhoodPhotos;

  // --- Surveyor ---
  surveyorName: string;
  surveyDate: string;   // YYYY-MM-DD
  remarks: string;
}

// ------------------------------------------------------------
// Default / empty record factory
// ------------------------------------------------------------
export const defaultBuilding = (id: number): Building => ({
  id,
  exists: false,
  type: "",
  area: 0,
  roof: "",
  walls: "",
  floor: "",
  windows: "",
  doors: "",
  accommodation: "",
  condition: "",
  photos: {},
});

export const defaultSurveyRecord = (): Omit<SurveyRecord, "id"> => ({
  createdAt: Date.now(),
  updatedAt: Date.now(),
  synced: false,
  syncError: undefined,

  serialNo: "",
  district: "",
  subCounty: "",
  parish: "",
  village: "",
  papNames: "",
  gender: "",
  nationalId: "",
  chainage: "",
  plotBlock: "",
  landTenure: "",

  landSize: "",
  landSizeUnit: "",
  roadAccess: false,

  gps: {
    latitude: null,
    longitude: null,
    accuracy: null,
    capturedAt: null,
  },

  buildings: [
    defaultBuilding(1),
    defaultBuilding(2),
    defaultBuilding(3),
    defaultBuilding(4),
  ],

  otherImprovements: "",

  services: {
    electricity: false,
    pipedWater: false,
    telephone: false,
    publicWell: false,
  },

  crops: [],

  neighbourhoodPhotos: {},

  surveyorName: "",
  surveyDate: new Date().toISOString().split("T")[0],
  remarks: "",
});
