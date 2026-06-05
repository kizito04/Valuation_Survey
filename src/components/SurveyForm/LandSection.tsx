// ============================================================
// Land Section
// ============================================================
import React from "react";
import type { SurveyRecord, LandSizeUnit } from "../../types/survey";

interface LandSectionProps {
  data: SurveyRecord;
  onChange: (changes: Partial<SurveyRecord>) => void;
}

const UNITS: LandSizeUnit[] = ["Acres", "Hectares", "Square metres", "Decimal"];

export const LandSection: React.FC<LandSectionProps> = ({ data, onChange }) => (
  <section className="form-section" id="section-land">
    <div className="form-section__header">
      <span className="form-section__icon">🌍</span>
      <h2 className="form-section__title">Land Details</h2>
    </div>

    <div className="form-grid-2">
      <div className="form-group">
        <label className="form-label" htmlFor="landSize">Land Size</label>
        <input
          id="landSize"
          className="input"
          type="number"
          min={0}
          step="any"
          placeholder="0.00"
          value={data.landSize === "" ? "" : data.landSize}
          onChange={(e) =>
            onChange({ landSize: e.target.value === "" ? "" : Number(e.target.value) })
          }
        />
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="landSizeUnit">Unit</label>
        <select
          id="landSizeUnit"
          className="input"
          value={data.landSizeUnit}
          onChange={(e) => onChange({ landSizeUnit: e.target.value as LandSizeUnit })}
        >
          <option value="">Select unit…</option>
          {UNITS.map((u) => <option key={u}>{u}</option>)}
        </select>
      </div>
    </div>

    <div className="form-group">
      <label className="checkbox-label">
        <input
          type="checkbox"
          checked={data.roadAccess}
          onChange={(e) => onChange({ roadAccess: e.target.checked })}
          id="roadAccess"
        />
        <span>The property has road / motorway access</span>
      </label>
    </div>
  </section>
);
