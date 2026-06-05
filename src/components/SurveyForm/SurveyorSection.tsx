// ============================================================
// Surveyor Metadata Section
// ============================================================
import React from "react";
import type { SurveyRecord } from "../../types/survey";

interface SurveyorSectionProps {
  data: SurveyRecord;
  onChange: (changes: Partial<SurveyRecord>) => void;
}

export const SurveyorSection: React.FC<SurveyorSectionProps> = ({
  data,
  onChange,
}) => (
  <section className="form-section" id="section-surveyor">
    <div className="form-section__header">
      <span className="form-section__icon">📋</span>
      <h2 className="form-section__title">Surveyor Details</h2>
    </div>

    <div className="form-grid-2">
      <div className="form-group">
        <label className="form-label form-label--required" htmlFor="surveyorName">Surveyor Name</label>
        <input
          id="surveyorName"
          className="input"
          type="text"
          placeholder="Enter your full name"
          value={data.surveyorName}
          onChange={(e) => onChange({ surveyorName: e.target.value })}
        />
      </div>

      <div className="form-group">
        <label className="form-label form-label--required" htmlFor="surveyDate">Survey Date</label>
        <input
          id="surveyDate"
          className="input"
          type="date"
          value={data.surveyDate}
          onChange={(e) => onChange({ surveyDate: e.target.value })}
        />
      </div>
    </div>

    <div className="form-group">
      <label className="form-label" htmlFor="remarks">Field Remarks / Observations</label>
      <textarea
        id="remarks"
        className="input input--textarea"
        rows={3}
        placeholder="Enter any relevant observations, disputes, or notes..."
        value={data.remarks}
        onChange={(e) => onChange({ remarks: e.target.value })}
      />
    </div>
  </section>
);
