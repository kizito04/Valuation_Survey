// ============================================================
// Neighbourhood Photos Section
// ============================================================
import React from "react";
import type { SurveyRecord, NeighbourhoodPhotos } from "../../types/survey";
import { PhotoInput } from "../PhotoInput";

interface NeighbourhoodSectionProps {
  data: SurveyRecord;
  onChange: (changes: Partial<SurveyRecord>) => void;
}

export const NeighbourhoodSection: React.FC<NeighbourhoodSectionProps> = ({
  data,
  onChange,
}) => {
  const handlePhotoCapture = (key: keyof NeighbourhoodPhotos, base64: string | null) => {
    onChange({
      neighbourhoodPhotos: {
        ...data.neighbourhoodPhotos,
        [key]: base64 ?? undefined,
      },
    });
  };

  return (
    <section className="form-section" id="section-neighbourhood">
      <div className="form-section__header">
        <span className="form-section__icon">📸</span>
        <h2 className="form-section__title">Neighbourhood & Surroundings</h2>
      </div>

      <div className="photo-grid">
        <PhotoInput
          label="General view of property 1"
          previewUrl={data.neighbourhoodPhotos.general1}
          onCapture={(v) => handlePhotoCapture("general1", v)}
        />
        <PhotoInput
          label="General view of property 2"
          previewUrl={data.neighbourhoodPhotos.general2}
          onCapture={(v) => handlePhotoCapture("general2", v)}
        />
        <PhotoInput
          label="Access Road / Path"
          previewUrl={data.neighbourhoodPhotos.accessRoad}
          onCapture={(v) => handlePhotoCapture("accessRoad", v)}
        />
        <PhotoInput
          label="Immediate Surroundings"
          previewUrl={data.neighbourhoodPhotos.surroundings}
          onCapture={(v) => handlePhotoCapture("surroundings", v)}
        />
      </div>
    </section>
  );
};
