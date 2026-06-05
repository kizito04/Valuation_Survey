// ============================================================
// Buildings Section
// ============================================================
import React from "react";
import type { SurveyRecord, Building } from "../../types/survey";
import { BuildingsTabs } from "../BuildingsTabs";

interface BuildingsSectionProps {
  data: SurveyRecord;
  onChange: (changes: Partial<SurveyRecord>) => void;
}

export const BuildingsSection: React.FC<BuildingsSectionProps> = ({
  data,
  onChange,
}) => {
  const handleBuildingsChange = (
    buildings: [Building, Building, Building, Building]
  ) => {
    onChange({ buildings });
  };

  return (
    <section className="form-section" id="section-buildings">
      <div className="form-section__header">
        <span className="form-section__icon">🏢</span>
        <h2 className="form-section__title">Buildings & Structures</h2>
      </div>

      <BuildingsTabs
        buildings={data.buildings}
        onChange={handleBuildingsChange}
      />
    </section>
  );
};
