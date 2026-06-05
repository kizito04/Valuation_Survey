import React from "react";

interface LandingPageProps {
  onNavigate: (view: "form" | "records") => void;
  pendingCount: number;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onNavigate,
  pendingCount,
}) => {
  return (
    <div className="landing-page">
      <div className="landing-hero">
        <span className="landing-hero__icon" role="img" aria-label="survey icon">📋</span>
        <h2 className="landing-hero__title">Valuation Survey</h2>
      
      </div>

      <div className="landing-menu">
        <div className="menu-card" onClick={() => onNavigate("form")}>
          <span className="menu-card__icon" role="img" aria-label="add icon">➕</span>
          <h3 className="menu-card__title">Add New Record</h3>
          
        </div>

        <div className="menu-card menu-card--accent" onClick={() => onNavigate("records")}>
          <span className="menu-card__icon" role="img" aria-label="records icon">📁</span>
          <h3 className="menu-card__title">Saved Records</h3>
          <p className="menu-card__desc">
            ......
            {pendingCount > 0 && (
              <span className="sync-status__badge" style={{ marginLeft: "8px" }}>
                {pendingCount} unsynced
              </span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};
