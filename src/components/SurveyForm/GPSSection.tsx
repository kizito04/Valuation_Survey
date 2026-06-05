// ============================================================
// GPS Section
// ============================================================
import React from "react";
import type { SurveyRecord } from "../../types/survey";
import { useGeolocation } from "../../hooks/useGeolocation";

interface GPSSectionProps {
  data: SurveyRecord;
  onChange: (changes: Partial<SurveyRecord>) => void;
}

export const GPSSection: React.FC<GPSSectionProps> = ({ data, onChange }) => {
  const { position, error, isLocating, getPosition } = useGeolocation();

  const handleCapture = () => {
    getPosition();
  };

  // Sync state up when hook state changes
  React.useEffect(() => {
    if (position.latitude !== null) {
      onChange({ gps: position });
    }
  }, [position, onChange]);

  return (
    <section className="form-section" id="section-gps">
      <div className="form-section__header">
        <span className="form-section__icon">📍</span>
        <h2 className="form-section__title">GPS Coordinates</h2>
      </div>

      <div className="gps-widget">
        <div className="gps-widget__actions">
          <button
            type="button"
            className="btn btn--primary"
            onClick={handleCapture}
            disabled={isLocating}
            id="detect-gps-btn"
          >
            {isLocating ? "Locating..." : "Detect my location"}
          </button>
        </div>

        {error && <div className="gps-widget__error">{error}</div>}

        <div className="gps-widget__coords">
          <div className="coord-box">
            <span className="coord-box__label">Latitude</span>
            <span className="coord-box__value">
              {data.gps.latitude !== null ? data.gps.latitude.toFixed(6) : "—"}
            </span>
          </div>
          <div className="coord-box">
            <span className="coord-box__label">Longitude</span>
            <span className="coord-box__value">
              {data.gps.longitude !== null ? data.gps.longitude.toFixed(6) : "—"}
            </span>
          </div>
          <div className="coord-box">
            <span className="coord-box__label">Accuracy (m)</span>
            <span className="coord-box__value">
              {data.gps.accuracy !== null ? `${data.gps.accuracy.toFixed(1)} m` : "—"}
            </span>
          </div>
        </div>

        {data.gps.capturedAt && (
          <div className="gps-widget__timestamp">
            Captured at: {new Date(data.gps.capturedAt).toLocaleString()}
          </div>
        )}
      </div>
    </section>
  );
};
