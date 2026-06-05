import React, { useEffect, useState } from "react";
import type { SurveyRecord } from "../types/survey";
import { getAllSurveys, deleteSurvey } from "../db/dexie";
import { exportToCSV } from "../utils/exportToCSV";

interface RecordsPageProps {
  onBack: () => void;
  onViewRecord: (record: SurveyRecord) => void;
  onEditRecord: (record: SurveyRecord) => void;
  onRecordSaved?: number; // trigger refresh
}

export const RecordsPage: React.FC<RecordsPageProps> = ({
  onBack,
  onViewRecord,
  onEditRecord,
  onRecordSaved,
}) => {
  const [records, setRecords] = useState<SurveyRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const loadRecords = async () => {
    setIsLoading(true);
    const all = await getAllSurveys();
    setRecords(all);
    setIsLoading(false);
  };

  useEffect(() => {
    loadRecords();
  }, [onRecordSaved]);

  const handleDelete = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation(); // prevent card click (view record)
    if (!confirm("Delete this record permanently from local storage?")) return;
    setDeletingId(id);
    await deleteSurvey(id);
    await loadRecords();
    setDeletingId(null);
  };

  const handleEditClick = (e: React.MouseEvent, record: SurveyRecord) => {
    e.stopPropagation(); // prevent card click
    onEditRecord(record);
  };

  const syncBadge = (r: SurveyRecord) => {
    if (r.synced) return <span className="badge badge--success">Synced</span>;
    if (r.syncError) return <span className="badge badge--error" title={r.syncError}>Sync Error</span>;
    return <span className="badge badge--warning">Offline Pending</span>;
  };

  return (
    <div className="records-page">
      {/* Header and navigation */}
      <div className="sub-header">
        <button type="button" className="back-btn" onClick={onBack} aria-label="Back">
          ←
        </button>
        <h2 className="sub-header__title" style={{ flexGrow: 1 }}>Saved Records</h2>
        <button
          type="button"
          className="btn btn--outline btn--sm"
          onClick={() => exportToCSV(records)}
          disabled={records.length === 0}
          id="export-csv-btn"
        >
          ↓ Export CSV
        </button>
      </div>

      {isLoading ? (
        <div className="records-list__loading">
          <span className="spinner spinner--lg" />
          <p>Loading saved survey logs…</p>
        </div>
      ) : records.length === 0 ? (
        <div className="records-list__empty">
          <span className="records-list__empty-icon">📂</span>
          <p>No records saved yet.</p>
        </div>
      ) : (
        <div className="records-list">
          {records.map((r) => (
            <div
              key={r.id}
              className="record-card"
              onClick={() => onViewRecord(r)}
            >
              <div className="record-card__content">
                <span className="record-card__title">
                  {r.papNames || <span className="detail-item__value--empty">Unnamed PAP</span>}
                </span>
                <div className="record-card__meta">
                  <span>Serial: <strong>{r.serialNo || "N/A"}</strong></span>
                  <span>District: {r.district || "N/A"}</span>
                  <span>Date: {r.surveyDate}</span>
                </div>
                <div style={{ marginTop: "6px" }}>{syncBadge(r)}</div>
              </div>

              <div className="record-card__actions">
                <button
                  type="button"
                  className="btn btn--outline btn--sm"
                  onClick={(e) => handleEditClick(e, r)}
                  aria-label="Edit record"
                >
                  ✏️ Edit
                </button>
                <button
                  type="button"
                  className="btn btn--danger btn--icon btn--sm"
                  onClick={(e) => handleDelete(e, r.id!)}
                  disabled={deletingId === r.id}
                  aria-label="Delete record"
                >
                  🗑
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
