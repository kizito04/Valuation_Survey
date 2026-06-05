// ============================================================
// Main SurveyForm Component (Create & Edit Mode)
// ============================================================
import React, { useState } from "react";
import type { SurveyRecord } from "../../types/survey";
import { defaultSurveyRecord } from "../../types/survey";
import { saveSurvey, updateSurvey } from "../../db/dexie";
import { PAPSection } from "./PAPSection";
import { LandSection } from "./LandSection";
import { GPSSection } from "./GPSSection";
import { BuildingsSection } from "./BuildingsSection";
import { ImprovementsSection } from "./ImprovementsSection";
import { ServicesSection } from "./ServicesSection";
import { CropsSection } from "./CropsSection";
import { NeighbourhoodSection } from "./NeighbourhoodSection";
import { SurveyorSection } from "./SurveyorSection";

interface SurveyFormProps {
  initialData?: SurveyRecord;
  onSaved: () => void;
  onCancel: () => void;
}

export const SurveyForm: React.FC<SurveyFormProps> = ({
  initialData,
  onSaved,
  onCancel,
}) => {
  const [formData, setFormData] = useState<SurveyRecord>(
    () => initialData || (defaultSurveyRecord() as SurveyRecord)
  );
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const isEditMode = !!formData.id;

  const handleChange = (changes: Partial<SurveyRecord>) => {
    setFormData((prev) => ({
      ...prev,
      ...changes,
      updatedAt: Date.now(),
    }));
  };

  const validate = (): boolean => {
    if (!formData.serialNo.trim()) {
      setError("Serial Number is required.");
      return false;
    }
    if (!formData.district.trim()) {
      setError("District is required.");
      return false;
    }
    if (!formData.papNames.trim()) {
      setError("PAP Name(s) are required.");
      return false;
    }
    if (!formData.surveyorName.trim()) {
      setError("Surveyor Name is required.");
      return false;
    }
    if (!formData.surveyDate) {
      setError("Survey Date is required.");
      return false;
    }
    setError(null);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    try {
      if (isEditMode) {
        const { id, ...changes } = formData;
        // Mark as unsynced again when edited, so it pushes changes to Firebase
        changes.synced = false;
        changes.syncError = undefined;
        await updateSurvey(id!, changes);
      } else {
        await saveSurvey(formData);
      }

      setSuccess(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
      setTimeout(() => {
        setSuccess(false);
        onSaved();
      }, 1500);
    } catch (err) {
      setError(
        `Failed to save record: ${err instanceof Error ? err.message : String(err)}`
      );
    }
  };

  return (
    <div className="survey-form-container">
      {/* Back arrow navigation */}
      <div className="sub-header">
        <button type="button" className="back-btn" onClick={onCancel} aria-label="Cancel">
          ←
        </button>
        <h2 className="sub-header__title">
          {isEditMode ? "Edit Valuation Record" : "Add Valuation Record"}
        </h2>
      </div>

      <form className="survey-form" onSubmit={handleSubmit}>
        {error && (
          <div className="alert alert--error" role="alert">
            <strong>Validation Error:</strong> {error}
          </div>
        )}

        {success && (
          <div className="alert alert--success" role="alert">
            🎉 <strong>Saved</strong> Record saved successfully.
          </div>
        )}

        <PAPSection data={formData} onChange={handleChange} />
        <LandSection data={formData} onChange={handleChange} />
        <GPSSection data={formData} onChange={handleChange} />
        <BuildingsSection data={formData} onChange={handleChange} />
        <ImprovementsSection data={formData} onChange={handleChange} />
        <ServicesSection data={formData} onChange={handleChange} />
        <CropsSection data={formData} onChange={handleChange} />
        <NeighbourhoodSection data={formData} onChange={handleChange} />
        <SurveyorSection data={formData} onChange={handleChange} />

        <div className="survey-form__submit-wrap" style={{ display: "flex", gap: "12px" }}>
          <button
            type="button"
            className="btn btn--outline btn--lg"
            style={{ flex: 1 }}
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn--primary btn--lg"
            style={{ flex: 2 }}
            id="save-record-btn"
          >
            {isEditMode ? "Save Changes" : "Save Record"}
          </button>
        </div>
      </form>
    </div>
  );
};
