import React, { useState } from "react";
import { SurveyForm } from "./components/SurveyForm";
import { SyncStatus } from "./components/SyncStatus";
import { LandingPage } from "./components/LandingPage";
import { RecordsPage } from "./components/RecordsPage";
import { SurveyDetail } from "./components/SurveyDetail";
import { useOfflineSync } from "./hooks/useOfflineSync";
import type { SurveyRecord } from "./types/survey";

export const App: React.FC = () => {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [currentView, setCurrentView] = useState<"landing" | "form" | "records" | "detail">("landing");
  const [selectedRecord, setSelectedRecord] = useState<SurveyRecord | null>(null);
  const [savedCounter, setSavedCounter] = useState(0);

  const { pendingCount } = useOfflineSync();

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const handleRecordSaved = () => {
    setSavedCounter((c) => c + 1);
    setSelectedRecord(null);
    setCurrentView("records"); // redirect to records page on save
  };

  const handleEditRecord = (record: SurveyRecord) => {
    setSelectedRecord(record);
    setCurrentView("form");
  };

  const handleViewRecord = (record: SurveyRecord) => {
    setSelectedRecord(record);
    setCurrentView("detail");
  };

  const handleAddNewRecord = () => {
    setSelectedRecord(null);
    setCurrentView("form");
  };

  const handleFormCancel = () => {
    if (selectedRecord) {
      // If we were editing, go back to details or list
      setCurrentView("records");
    } else {
      setCurrentView("landing");
    }
    setSelectedRecord(null);
  };

  return (
    <div className={`app-wrapper theme-${theme}`}>
      {/* Top sticky navigation bar */}
      <header className="header">
        <div className="header__title-wrap">
          <span className="header__logo" role="img" aria-label="train logo">🚉</span>
          <div>
            <h1 className="header__title">SGR Valuation</h1>
            <p className="header__subtitle">Survey System</p>
          </div>
        </div>

        <div className="header__controls">
          <SyncStatus />
          {/* Theme switcher */}
          <button
            type="button"
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
          >
            {theme === "light" ? "🌙" : "☀️"}
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="app-container">
        {currentView === "landing" && (
          <LandingPage
            onNavigate={(view) => {
              if (view === "form") handleAddNewRecord();
              else setCurrentView("records");
            }}
            pendingCount={pendingCount}
          />
        )}

        {currentView === "form" && (
          <SurveyForm
            key={selectedRecord?.id || "new"}
            initialData={selectedRecord || undefined}
            onSaved={handleRecordSaved}
            onCancel={handleFormCancel}
          />
        )}

        {currentView === "records" && (
          <RecordsPage
            onBack={() => setCurrentView("landing")}
            onViewRecord={handleViewRecord}
            onEditRecord={handleEditRecord}
            onRecordSaved={savedCounter}
          />
        )}

        {currentView === "detail" && selectedRecord && (
          <SurveyDetail
            record={selectedRecord}
            onBack={() => setCurrentView("records")}
            onEdit={() => setCurrentView("form")}
          />
        )}
      </main>
    </div>
  );
};

export default App;
