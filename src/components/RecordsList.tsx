// ============================================================
// RecordsList — Modal showing saved surveys with CSV export
// ============================================================
import React, { useEffect, useState } from "react";
import type { SurveyRecord } from "../types/survey";
import { getAllSurveys, deleteSurvey } from "../db/dexie";
import { exportToCSV } from "../utils/exportToCSV";

interface RecordsListProps {
  onClose: () => void;
  onRecordSaved?: number; // bump to trigger refresh
}

export const RecordsList: React.FC<RecordsListProps> = ({
  onClose,
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

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this record permanently?")) return;
    setDeletingId(id);
    await deleteSurvey(id);
    await loadRecords();
    setDeletingId(null);
  };

  const syncBadge = (r: SurveyRecord) => {
    if (r.synced) return <span className="badge badge--success">Synced</span>;
    if (r.syncError) return <span className="badge badge--error" title={r.syncError}>Error</span>;
    return <span className="badge badge--warning">Pending</span>;
  };

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-label="Saved Records">
      <div className="modal">
        <div className="modal__header">
          <h2 className="modal__title">Saved Records ({records.length})</h2>
          <div className="modal__actions">
            <button
              type="button"
              className="btn btn--outline btn--sm"
              onClick={() => exportToCSV(records)}
              disabled={records.length === 0}
              id="export-csv-btn"
            >
              ↓ Export CSV
            </button>
            <button
              type="button"
              className="btn btn--ghost btn--icon"
              onClick={onClose}
              aria-label="Close records"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="modal__body">
          {isLoading ? (
            <div className="records-list__loading">
              <span className="spinner spinner--lg" />
              <p>Loading records…</p>
            </div>
          ) : records.length === 0 ? (
            <div className="records-list__empty">
              <span className="records-list__empty-icon">📋</span>
              <p>No records saved yet.</p>
            </div>
          ) : (
            <div className="records-list__table-wrap">
              <table className="records-list__table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Serial No.</th>
                    <th>PAP Name</th>
                    <th>District</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((r, i) => (
                    <tr key={r.id} className="records-list__row">
                      <td className="records-list__num">{i + 1}</td>
                      <td className="records-list__serial">{r.serialNo || "—"}</td>
                      <td className="records-list__name">{r.papNames || "—"}</td>
                      <td>{r.district || "—"}</td>
                      <td>{r.surveyDate || "—"}</td>
                      <td>{syncBadge(r)}</td>
                      <td>
                        <button
                          type="button"
                          className="btn btn--danger btn--icon btn--sm"
                          onClick={() => handleDelete(r.id!)}
                          disabled={deletingId === r.id}
                          aria-label="Delete record"
                        >
                          🗑
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
