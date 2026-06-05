// ============================================================
// Main SurveyForm Component
// ============================================================
import React, { useState } from "react";
import type { SurveyRecord } from "../../types/survey";
import { defaultSurveyRecord } from "../../types/survey";
import { saveSurvey } from "../../db/dexie";
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
  onSaved: () => void;
}

export const SurveyForm: React.FC<SurveyFormProps> = ({ onSaved }) => {
  const [formData, setFormData] = useState<Omit<SurveyRecord, "id">>(
    defaultSurveyRecord()
  );
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

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
      // Scroll to error or top
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    try {
      await saveSurvey(formData);
      setSuccess(true);
      setFormData(defaultSurveyRecord());
      onSaved();
      window.scrollTo({ top: 0, behavior: "smooth" });
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setError(
        `Failed to save record: ${err instanceof Error ? err.message : String(err)}`
      );
    }
  };

  return (
    <form className="survey-form" onSubmit={handleSubmit}>
      {error && (
        <div className="alert alert--error" role="alert">
          <strong>Validation Error:</strong> {error}
        </div>
      )}

      {success && (
        <div className="alert alert--success" role="alert">
          🎉 <strong>Saved Offline!</strong> Record stored successfully in IndexedDB. It will automatically sync when online.
        </div>
      )}

      <PAPSection data={formData as SurveyRecord} onChange={handleChange} />
      <LandSection data={formData as SurveyRecord} onChange={handleChange} />
      <GPSSection data={formData as SurveyRecord} onChange={handleChange} />
      <BuildingsSection data={formData as SurveyRecord} onChange={handleChange} />
      <ImprovementsSection data={formData as SurveyRecord} onChange={handleChange} />
      <ServicesSection data={formData as SurveyRecord} onChange={handleChange} />
      <CropsSection data={formData as SurveyRecord} onChange={handleChange} />
      <NeighbourhoodSection data={formData as SurveyRecord} onChange={handleChange} />
      <SurveyorSection data={formData as SurveyRecord} onChange={handleChange} />

      <div className="survey-form__submit-wrap">
        <button type="submit" className="btn btn--primary btn--lg" id="save-record-btn">
          Save Record (Offline-First)
        </button>
      </div>
    </form>
  );
};
