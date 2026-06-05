// ============================================================
// Improvements Section
// ============================================================
import React from "react";
import type { SurveyRecord } from "../../types/survey";

interface ImprovementsSectionProps {
  data: SurveyRecord;
  onChange: (changes: Partial<SurveyRecord>) => void;
}

export const ImprovementsSection: React.FC<ImprovementsSectionProps> = ({
  data,
  onChange,
}) => (
  <section className="form-section" id="section-improvements">
    <div className="form-section__header">
      <span className="form-section__icon">🛠</span>
      <h2 className="form-section__title">Other Improvements</h2>
    </div>

    <div className="form-group">
      <label className="form-label" htmlFor="otherImprovements">
        Description of other developments/improvements (e.g. graves, fences, gates, water tanks)
      </label>
      <textarea
        id="otherImprovements"
        className="input input--textarea"
        rows={4}
        placeholder="Enter details of any other structures or improvements on the property..."
        value={data.otherImprovements}
        onChange={(e) => onChange({ otherImprovements: e.target.value })}
      />
    </div>
  </section>
);
