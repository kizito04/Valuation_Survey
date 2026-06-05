// ============================================================
// PAP Identification Section
// ============================================================
import React from "react";
import type { SurveyRecord, Gender } from "../../types/survey";

interface PAPSectionProps {
  data: SurveyRecord;
  onChange: (changes: Partial<SurveyRecord>) => void;
}

const DISTRICTS = [
  "Busia", "Tororo", "Iganga", "Bugiri", "Mayuge", "Namayingo",
  "Buikwe", "Mukono", "Kampala", "Other",
];
const TENURE_TYPES = [
  "Freehold", "Mailo", "Leasehold", "Customary", "Public Land",
];

export const PAPSection: React.FC<PAPSectionProps> = ({ data, onChange }) => (
  <section className="form-section" id="section-pap">
    <div className="form-section__header">
      <span className="form-section__icon">👤</span>
      <h2 className="form-section__title">PAP Identification</h2>
    </div>

    <div className="form-grid-2">
      <div className="form-group">
        <label className="form-label form-label--required" htmlFor="serialNo">Serial No.</label>
        <input id="serialNo" className="input" type="text" placeholder="e.g. SGR-001"
          value={data.serialNo} onChange={(e) => onChange({ serialNo: e.target.value })} />
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="chainage">Chainage</label>
        <input id="chainage" className="input" type="text" placeholder="e.g. CH 145+500"
          value={data.chainage} onChange={(e) => onChange({ chainage: e.target.value })} />
      </div>

      <div className="form-group">
        <label className="form-label form-label--required" htmlFor="district">District</label>
        <select id="district" className="input" value={data.district}
          onChange={(e) => onChange({ district: e.target.value })}>
          <option value="">Select district…</option>
          {DISTRICTS.map((d) => <option key={d}>{d}</option>)}
        </select>
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="subCounty">Sub-County</label>
        <input id="subCounty" className="input" type="text" placeholder="Sub-County"
          value={data.subCounty} onChange={(e) => onChange({ subCounty: e.target.value })} />
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="parish">Parish</label>
        <input id="parish" className="input" type="text" placeholder="Parish"
          value={data.parish} onChange={(e) => onChange({ parish: e.target.value })} />
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="village">Village</label>
        <input id="village" className="input" type="text" placeholder="Village"
          value={data.village} onChange={(e) => onChange({ village: e.target.value })} />
      </div>
    </div>

    <div className="form-group">
      <label className="form-label form-label--required" htmlFor="papNames">PAP Full Name(s)</label>
      <input id="papNames" className="input" type="text" placeholder="Full name(s) of Project Affected Person(s)"
        value={data.papNames} onChange={(e) => onChange({ papNames: e.target.value })} />
    </div>

    <div className="form-grid-3">
      <div className="form-group">
        <label className="form-label" htmlFor="gender">Gender</label>
        <select id="gender" className="input" value={data.gender}
          onChange={(e) => onChange({ gender: e.target.value as Gender })}>
          <option value="">Select…</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="nationalId">National ID / Passport</label>
        <input id="nationalId" className="input" type="text" placeholder="ID number"
          value={data.nationalId} onChange={(e) => onChange({ nationalId: e.target.value })} />
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="plotBlock">Plot / Block No.</label>
        <input id="plotBlock" className="input" type="text" placeholder="Plot or block"
          value={data.plotBlock} onChange={(e) => onChange({ plotBlock: e.target.value })} />
      </div>
    </div>

    <div className="form-group">
      <label className="form-label" htmlFor="landTenure">Land Tenure Type</label>
      <select id="landTenure" className="input" value={data.landTenure}
        onChange={(e) => onChange({ landTenure: e.target.value })}>
        <option value="">Select tenure…</option>
        {TENURE_TYPES.map((t) => <option key={t}>{t}</option>)}
      </select>
    </div>
  </section>
);
