// ============================================================
// Crops Section
// ============================================================
import React from "react";
import type { SurveyRecord, CropRow } from "../../types/survey";
import { CropsTable } from "../CropsTable";

interface CropsSectionProps {
  data: SurveyRecord;
  onChange: (changes: Partial<SurveyRecord>) => void;
}

export const CropsSection: React.FC<CropsSectionProps> = ({
  data,
  onChange,
}) => {
  const handleCropsChange = (crops: CropRow[]) => {
    onChange({ crops });
  };

  return (
    <section className="form-section" id="section-crops">
      <div className="form-section__header">
        <span className="form-section__icon">🌾</span>
        <h2 className="form-section__title">Crops & Economic Trees</h2>
      </div>

      <p className="form-section__intro">
        List all seasonal crops, perennial crops, and trees present on the affected land.
      </p>

      <CropsTable crops={data.crops} onChange={handleCropsChange} />
    </section>
  );
};
