import React, { useState } from "react";
import { SurveyForm } from "./components/SurveyForm";
import { SyncStatus } from "./components/SyncStatus";
import { RecordsList } from "./components/RecordsList";

export const App: React.FC = () => {
  const [showRecords, setShowRecords] = useState(false);
  const [savedCounter, setSavedCounter] = useState(0);

  const handleRecordSaved = () => {
    setSavedCounter((c) => c + 1);
  };

  return (
    <div className="app-container">
      {/* Top sticky navigation bar */}
      <header className="header">
        <div className="header__title-wrap">
          <span className="header__logo" role="img" aria-label="train logo">🚉</span>
          <div>
            <h1 className="header__title">SGR Valuation Survey</h1>
            <p className="header__subtitle">Malaba–Kampala Section</p>
          </div>
        </div>

        <SyncStatus />
      </header>

      {/* Main survey record input form */}
      <main>
        <SurveyForm onSaved={handleRecordSaved} />
      </main>

      {/* Floating Action Button (FAB) to view saved records */}
      <button
        type="button"
        className="fab"
        onClick={() => setShowRecords(true)}
        title="View saved records"
        aria-label="View saved records list"
        id="view-records-fab"
      >
        📋
      </button>

      {/* Overlay Modal with Saved Records */}
      {showRecords && (
        <RecordsList
          onClose={() => setShowRecords(false)}
          onRecordSaved={savedCounter}
        />
      )}
    </div>
  );
};

export default App;
