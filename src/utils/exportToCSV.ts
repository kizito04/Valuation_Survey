// ============================================================
// CSV Export Utility — uses PapaParse
// ============================================================
import Papa from "papaparse";
import type { SurveyRecord } from "../types/survey";

/**
 * Flatten a SurveyRecord into a single CSV row.
 * Photos are represented as boolean flags (has_X_photo).
 */
function flattenRecord(record: SurveyRecord): Record<string, unknown> {
  const row: Record<string, unknown> = {
    id: record.id,
    firebaseId: record.firebaseId ?? "",
    createdAt: new Date(record.createdAt).toISOString(),
    synced: record.synced,
    syncError: record.syncError ?? "",

    // PAP Identification
    serialNo: record.serialNo,
    district: record.district,
    subCounty: record.subCounty,
    parish: record.parish,
    village: record.village,
    papNames: record.papNames,
    gender: record.gender,
    nationalId: record.nationalId,
    chainage: record.chainage,
    plotBlock: record.plotBlock,
    landTenure: record.landTenure,

    // Land
    landSize: record.landSize,
    landSizeUnit: record.landSizeUnit,
    roadAccess: record.roadAccess,

    // GPS
    gps_latitude: record.gps.latitude ?? "",
    gps_longitude: record.gps.longitude ?? "",
    gps_accuracy: record.gps.accuracy ?? "",
    gps_capturedAt: record.gps.capturedAt
      ? new Date(record.gps.capturedAt).toISOString()
      : "",

    // Other improvements
    otherImprovements: record.otherImprovements,

    // Services
    services_electricity: record.services.electricity,
    services_pipedWater: record.services.pipedWater,
    services_telephone: record.services.telephone,
    services_publicWell: record.services.publicWell,

    // Crops (semicolon-separated summary)
    crops_count: record.crops.length,
    crops_summary: record.crops
      .map((c) => `${c.name}(${c.quantity} ${c.unit}, ${c.condition})`)
      .join("; "),

    // Neighbourhood photos — boolean flags
    has_photo_general1: !!record.neighbourhoodPhotos.general1,
    has_photo_general2: !!record.neighbourhoodPhotos.general2,
    has_photo_accessRoad: !!record.neighbourhoodPhotos.accessRoad,
    has_photo_surroundings: !!record.neighbourhoodPhotos.surroundings,

    // Surveyor
    surveyorName: record.surveyorName,
    surveyDate: record.surveyDate,
    remarks: record.remarks,
  };

  // Buildings — flatten each of the 4
  record.buildings.forEach((b, i) => {
    const n = i + 1;
    row[`building${n}_exists`] = b.exists;
    if (b.exists) {
      row[`building${n}_type`] = b.type;
      row[`building${n}_area`] = b.area;
      row[`building${n}_roof`] = b.roof;
      row[`building${n}_walls`] = b.walls;
      row[`building${n}_floor`] = b.floor;
      row[`building${n}_windows`] = b.windows;
      row[`building${n}_doors`] = b.doors;
      row[`building${n}_accommodation`] = b.accommodation;
      row[`building${n}_condition`] = b.condition;
      row[`building${n}_has_front_photo`] = !!b.photos.front;
      row[`building${n}_has_interior_photo`] = !!b.photos.interior;
    }
  });

  return row;
}

/**
 * Export an array of SurveyRecords to a downloadable CSV file.
 */
export function exportToCSV(records: SurveyRecord[]): void {
  if (records.length === 0) {
    alert("No records to export.");
    return;
  }

  const rows = records.map(flattenRecord);
  const csv = Papa.unparse(rows, { header: true });
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const date = new Date().toISOString().split("T")[0];
  const a = document.createElement("a");
  a.href = url;
  a.download = `valuation_survey_export_${date}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
