// ============================================================
// Services Section
// ============================================================
import React from "react";
import type { SurveyRecord, ServiceFlags } from "../../types/survey";

interface ServicesSectionProps {
  data: SurveyRecord;
  onChange: (changes: Partial<SurveyRecord>) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  data,
  onChange,
}) => {
  const handleServiceChange = (key: keyof ServiceFlags, checked: boolean) => {
    onChange({
      services: {
        ...data.services,
        [key]: checked,
      },
    });
  };

  return (
    <section className="form-section" id="section-services">
      <div className="form-section__header">
        <span className="form-section__icon">🔌</span>
        <h2 className="form-section__title">Available Services</h2>
      </div>

      <div className="services-grid">
        <label className="checkbox-label checkbox-label--card">
          <input
            type="checkbox"
            checked={data.services.electricity}
            onChange={(e) => handleServiceChange("electricity", e.target.checked)}
          />
          <span className="checkbox-label__text">⚡ Electricity Connection</span>
        </label>

        <label className="checkbox-label checkbox-label--card">
          <input
            type="checkbox"
            checked={data.services.pipedWater}
            onChange={(e) => handleServiceChange("pipedWater", e.target.checked)}
          />
          <span className="checkbox-label__text">🚰 Piped Water</span>
        </label>

        <label className="checkbox-label checkbox-label--card">
          <input
            type="checkbox"
            checked={data.services.telephone}
            onChange={(e) => handleServiceChange("telephone", e.target.checked)}
          />
          <span className="checkbox-label__text">📞 Telephone/Telecom Network</span>
        </label>

        <label className="checkbox-label checkbox-label--card">
          <input
            type="checkbox"
            checked={data.services.publicWell}
            onChange={(e) => handleServiceChange("publicWell", e.target.checked)}
          />
          <span className="checkbox-label__text">⛲ Public Well / Borehole</span>
        </label>
      </div>
    </section>
  );
};
