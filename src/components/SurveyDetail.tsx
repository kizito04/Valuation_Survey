import React from "react";
import type { SurveyRecord } from "../types/survey";

interface SurveyDetailProps {
  record: SurveyRecord;
  onBack: () => void;
  onEdit: () => void;
}

export const SurveyDetail: React.FC<SurveyDetailProps> = ({
  record,
  onBack,
  onEdit,
}) => {
  const syncBadge = (r: SurveyRecord) => {
    if (r.synced) return <span className="badge badge--success">Synced</span>;
    if (r.syncError) return <span className="badge badge--error" title={r.syncError}>Sync Error</span>;
    return <span className="badge badge--warning">Offline Pending</span>;
  };

  const renderDetailItem = (label: string, value: string | number | boolean | null | undefined, isEmptyText = "—") => {
    let displayValue: React.ReactNode = value;
    if (value === true) displayValue = "Yes";
    if (value === false) displayValue = "No";
    if (value === null || value === undefined || value === "") {
      displayValue = <span className="detail-item__value--empty">{isEmptyText}</span>;
    }

    return (
      <div className="detail-item">
        <span className="detail-item__label">{label}</span>
        <span className="detail-item__value">{displayValue}</span>
      </div>
    );
  };

  return (
    <div className="detail-view">
      {/* Header Navigation */}
      <div className="sub-header">
        <button type="button" className="back-btn" onClick={onBack} aria-label="Back">
          ←
        </button>
        <div style={{ flexGrow: 1 }}>
          <h2 className="sub-header__title">Survey Details</h2>
          <div style={{ display: "flex", gap: "8px", marginTop: "4px", alignItems: "center" }}>
            <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
              Serial: <strong>{record.serialNo}</strong>
            </span>
            {syncBadge(record)}
          </div>
        </div>
        <button type="button" className="btn btn--outline btn--sm" onClick={onEdit}>
          ✏️ Edit
        </button>
      </div>

      {/* 1. PAP Details Card */}
      <div className="detail-card">
        <h3 className="detail-card__title">👤 Project Affected Person (PAP) Identification</h3>
        <div className="detail-grid">
          {renderDetailItem("PAP Full Name", record.papNames)}
          {renderDetailItem("Serial Number", record.serialNo)}
          {renderDetailItem("Gender", record.gender)}
          {renderDetailItem("National ID / Passport", record.nationalId)}
          {renderDetailItem("Chainage", record.chainage)}
          {renderDetailItem("District", record.district)}
          {renderDetailItem("Sub-County", record.subCounty)}
          {renderDetailItem("Parish", record.parish)}
          {renderDetailItem("Village", record.village)}
          {renderDetailItem("Plot / Block No.", record.plotBlock)}
          {renderDetailItem("Land Tenure", record.landTenure)}
        </div>
      </div>

      {/* 2. Land & Access Card */}
      <div className="detail-card">
        <h3 className="detail-card__title">🌍 Land & Access</h3>
        <div className="detail-grid">
          {renderDetailItem("Land Size", record.landSize ? `${record.landSize} ${record.landSizeUnit || ""}` : null)}
          {renderDetailItem("Road Access", record.roadAccess)}
        </div>
      </div>

      {/* 3. GPS Card */}
      <div className="detail-card">
        <h3 className="detail-card__title">📍 GPS Capture</h3>
        <div className="detail-grid">
          {renderDetailItem("Latitude", record.gps.latitude)}
          {renderDetailItem("Longitude", record.gps.longitude)}
          {renderDetailItem("Accuracy", record.gps.accuracy ? `${record.gps.accuracy.toFixed(1)} m` : null)}
          {renderDetailItem(
            "Captured At",
            record.gps.capturedAt ? new Date(record.gps.capturedAt).toLocaleString() : null
          )}
        </div>
      </div>

      {/* 4. Buildings Card */}
      <div className="detail-card">
        <h3 className="detail-card__title">🏢 Buildings & Structures</h3>
        {record.buildings.filter(b => b.exists).length === 0 ? (
          <p style={{ fontStyle: "italic", color: "var(--text-secondary)", fontSize: "14px" }}>
            No buildings/structures reported on this property.
          </p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {record.buildings.filter(b => b.exists).map((b) => (
              <div key={b.id} className="detail-building-block">
                <h4 className="detail-building-block__title">Building {b.id} — {b.type || "General"}</h4>
                <div className="detail-grid" style={{ marginTop: "8px" }}>
                  {renderDetailItem("Floor Area", b.area ? `${b.area} m²` : null)}
                  {renderDetailItem("Roof Type", b.roof)}
                  {renderDetailItem("Wall Type", b.walls)}
                  {renderDetailItem("Floor Type", b.floor)}
                  {renderDetailItem("Windows", b.windows)}
                  {renderDetailItem("Doors", b.doors)}
                  {renderDetailItem("Condition", b.condition)}
                  {renderDetailItem("Accommodation / Rooms", b.accommodation)}
                </div>

                {(b.photos.front || b.photos.interior) && (
                  <div className="detail-photos" style={{ marginTop: "12px" }}>
                    {b.photos.front && (
                      <div className="detail-photo-box">
                        <img src={b.photos.front} alt="Building front" className="detail-photo-box__img" />
                        <span className="detail-photo-box__label">Front View</span>
                      </div>
                    )}
                    {b.photos.interior && (
                      <div className="detail-photo-box">
                        <img src={b.photos.interior} alt="Building interior" className="detail-photo-box__img" />
                        <span className="detail-photo-box__label">Interior / Side View</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 5. Crops Card */}
      <div className="detail-card">
        <h3 className="detail-card__title">🌾 Crops & Economic Trees</h3>
        {record.crops.length === 0 ? (
          <p style={{ fontStyle: "italic", color: "var(--text-secondary)", fontSize: "14px" }}>
            No crops or trees recorded.
          </p>
        ) : (
          <div className="detail-crops-list">
            {record.crops.map((c) => (
              <div key={c.id} className="detail-crop-item">
                <span className="detail-crop-item__name">{c.name || "Unnamed Crop"}</span>
                <span className="detail-crop-item__qty">
                  {c.quantity} {c.unit}
                </span>
                <span className={`detail-crop-item__cond badge badge--${
                  c.condition === "Good" ? "success" : c.condition === "Fair" ? "warning" : "error"
                }`}>
                  {c.condition || "No Cond."}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 6. Services Card */}
      <div className="detail-card">
        <h3 className="detail-card__title">🔌 Utility Services</h3>
        <div className="detail-grid">
          {renderDetailItem("Electricity Connection", record.services.electricity)}
          {renderDetailItem("Piped Water", record.services.pipedWater)}
          {renderDetailItem("Telephone Network", record.services.telephone)}
          {renderDetailItem("Public Well / Borehole", record.services.publicWell)}
        </div>
      </div>

      {/* 7. Improvements Card */}
      <div className="detail-card">
        <h3 className="detail-card__title">🛠 Other Improvements</h3>
        {renderDetailItem("Description / Notes", record.otherImprovements, "No other improvements listed.")}
      </div>

      {/* 8. Neighbourhood Photos Card */}
      <div className="detail-card">
        <h3 className="detail-card__title">📸 Neighbourhood & Surroundings</h3>
        {Object.values(record.neighbourhoodPhotos).filter(Boolean).length === 0 ? (
          <p style={{ fontStyle: "italic", color: "var(--text-secondary)", fontSize: "14px" }}>
            No neighbourhood photos captured.
          </p>
        ) : (
          <div className="detail-photos">
            {record.neighbourhoodPhotos.general1 && (
              <div className="detail-photo-box">
                <img src={record.neighbourhoodPhotos.general1} alt="Property general 1" className="detail-photo-box__img" />
                <span className="detail-photo-box__label">General View 1</span>
              </div>
            )}
            {record.neighbourhoodPhotos.general2 && (
              <div className="detail-photo-box">
                <img src={record.neighbourhoodPhotos.general2} alt="Property general 2" className="detail-photo-box__img" />
                <span className="detail-photo-box__label">General View 2</span>
              </div>
            )}
            {record.neighbourhoodPhotos.accessRoad && (
              <div className="detail-photo-box">
                <img src={record.neighbourhoodPhotos.accessRoad} alt="Access road" className="detail-photo-box__img" />
                <span className="detail-photo-box__label">Access Road / Path</span>
              </div>
            )}
            {record.neighbourhoodPhotos.surroundings && (
              <div className="detail-photo-box">
                <img src={record.neighbourhoodPhotos.surroundings} alt="Property surroundings" className="detail-photo-box__img" />
                <span className="detail-photo-box__label">Immediate Surroundings</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 9. Surveyor Metadata Card */}
      <div className="detail-card">
        <h3 className="detail-card__title">📋 Surveyor Metadata</h3>
        <div className="detail-grid">
          {renderDetailItem("Surveyor Name", record.surveyorName)}
          {renderDetailItem("Survey Date", record.surveyDate)}
          {renderDetailItem("Field Remarks", record.remarks)}
        </div>
      </div>
    </div>
  );
};
