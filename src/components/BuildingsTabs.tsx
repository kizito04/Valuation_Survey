// ============================================================
// BuildingsTabs — 4-tab building editor with photo capture
// ============================================================
import React, { useState } from "react";
import type { Building, BuildingCondition } from "../types/survey";
import { PhotoInput } from "./PhotoInput";

interface BuildingsTabsProps {
  buildings: [Building, Building, Building, Building];
  onChange: (buildings: [Building, Building, Building, Building]) => void;
}

const BUILDING_TYPES = [
  "Residential", "Commercial", "Industrial", "Agricultural",
  "Institutional", "Mixed Use", "Other",
];
const ROOF_TYPES = ["Iron sheets", "Tiles", "Concrete", "Grass/Thatch", "Other"];
const WALL_TYPES = ["Brick/Block", "Stone", "Mud/Wattle", "Timber", "Iron sheets", "Other"];
const FLOOR_TYPES = ["Concrete", "Tiles", "Earth", "Timber", "Terrazzo", "Other"];
const WINDOW_TYPES = ["Wooden", "Steel", "Aluminium", "PVC", "None"];
const DOOR_TYPES = ["Wooden", "Steel", "Aluminium", "PVC"];
const CONDITIONS: BuildingCondition[] = ["Good", "Fair", "Poor", "Dilapidated"];

const updateBuilding = (
  buildings: [Building, Building, Building, Building],
  index: number,
  changes: Partial<Building>
): [Building, Building, Building, Building] => {
  const updated = [...buildings] as [Building, Building, Building, Building];
  updated[index] = { ...updated[index], ...changes };
  return updated;
};

export const BuildingsTabs: React.FC<BuildingsTabsProps> = ({
  buildings,
  onChange,
}) => {
  const [activeTab, setActiveTab] = useState(0);

  const b = buildings[activeTab];

  const update = (changes: Partial<Building>) => {
    onChange(updateBuilding(buildings, activeTab, changes));
  };

  const updatePhoto = (key: "front" | "interior", value: string | null) => {
    update({ photos: { ...b.photos, [key]: value ?? undefined } });
  };

  return (
    <div className="buildings-tabs">
      {/* Tab headers */}
      <div className="buildings-tabs__nav" role="tablist">
        {buildings.map((bld, i) => (
          <button
            key={bld.id}
            role="tab"
            aria-selected={activeTab === i}
            className={`buildings-tabs__tab ${activeTab === i ? "buildings-tabs__tab--active" : ""}`}
            onClick={() => setActiveTab(i)}
            type="button"
          >
            Building {i + 1}
            {bld.exists && <span className="buildings-tabs__dot" />}
          </button>
        ))}
      </div>

      {/* Tab panel */}
      <div className="buildings-tabs__panel" role="tabpanel">
        {/* Existence toggle */}
        <label className="checkbox-label checkbox-label--prominent">
          <input
            type="checkbox"
            checked={b.exists}
            onChange={(e) => update({ exists: e.target.checked })}
          />
          <span>Building {b.id} exists on this property</span>
        </label>

        {b.exists && (
          <div className="buildings-tabs__fields">
            <div className="form-grid-2">
              {/* Type */}
              <div className="form-group">
                <label className="form-label">Building Type</label>
                <select className="input" value={b.type} onChange={(e) => update({ type: e.target.value })}>
                  <option value="">Select…</option>
                  {BUILDING_TYPES.map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>

              {/* Area */}
              <div className="form-group">
                <label className="form-label">Floor Area (m²)</label>
                <input
                  className="input"
                  type="number"
                  min={0}
                  placeholder="0"
                  value={b.area || ""}
                  onChange={(e) => update({ area: Number(e.target.value) })}
                />
              </div>

              {/* Roof */}
              <div className="form-group">
                <label className="form-label">Roof Type</label>
                <select className="input" value={b.roof} onChange={(e) => update({ roof: e.target.value })}>
                  <option value="">Select…</option>
                  {ROOF_TYPES.map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>

              {/* Walls */}
              <div className="form-group">
                <label className="form-label">Wall Type</label>
                <select className="input" value={b.walls} onChange={(e) => update({ walls: e.target.value })}>
                  <option value="">Select…</option>
                  {WALL_TYPES.map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>

              {/* Floor */}
              <div className="form-group">
                <label className="form-label">Floor Type</label>
                <select className="input" value={b.floor} onChange={(e) => update({ floor: e.target.value })}>
                  <option value="">Select…</option>
                  {FLOOR_TYPES.map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>

              {/* Windows */}
              <div className="form-group">
                <label className="form-label">Windows</label>
                <select className="input" value={b.windows} onChange={(e) => update({ windows: e.target.value })}>
                  <option value="">Select…</option>
                  {WINDOW_TYPES.map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>

              {/* Doors */}
              <div className="form-group">
                <label className="form-label">Doors</label>
                <select className="input" value={b.doors} onChange={(e) => update({ doors: e.target.value })}>
                  <option value="">Select…</option>
                  {DOOR_TYPES.map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>

              {/* Condition */}
              <div className="form-group">
                <label className="form-label">Overall Condition</label>
                <select
                  className="input"
                  value={b.condition}
                  onChange={(e) => update({ condition: e.target.value as BuildingCondition })}
                >
                  <option value="">Select…</option>
                  {CONDITIONS.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>

            {/* Accommodation */}
            <div className="form-group">
              <label className="form-label">Accommodation / Rooms Description</label>
              <input
                className="input"
                type="text"
                placeholder="e.g. 3 bedrooms, 1 sitting room, kitchen"
                value={b.accommodation}
                onChange={(e) => update({ accommodation: e.target.value })}
              />
            </div>

            {/* Photos */}
            <div className="buildings-tabs__photos">
              <PhotoInput
                label="Front View"
                previewUrl={b.photos.front}
                onCapture={(v) => updatePhoto("front", v)}
              />
              <PhotoInput
                label="Interior / Side View"
                previewUrl={b.photos.interior}
                onCapture={(v) => updatePhoto("interior", v)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
