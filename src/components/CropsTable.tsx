// ============================================================
// CropsTable — Dynamic crop rows manager
// ============================================================
import React from "react";
import { nanoid } from "nanoid";
import type { CropRow } from "../types/survey";

interface CropsTableProps {
  crops: CropRow[];
  onChange: (crops: CropRow[]) => void;
}

const CROP_CONDITIONS = ["Good", "Fair", "Poor"] as const;

export const CropsTable: React.FC<CropsTableProps> = ({ crops, onChange }) => {
  const addRow = () => {
    onChange([
      ...crops,
      { id: nanoid(), name: "", quantity: 0, unit: "kg", condition: "" },
    ]);
  };

  const updateRow = (id: string, field: keyof CropRow, value: string | number) => {
    onChange(crops.map((c) => (c.id === id ? { ...c, [field]: value } : c)));
  };

  const removeRow = (id: string) => {
    onChange(crops.filter((c) => c.id !== id));
  };

  return (
    <div className="crops-table">
      {crops.length > 0 && (
        <div className="crops-table__header">
          <span>Crop / Tree</span>
          <span>Quantity</span>
          <span>Unit</span>
          <span>Condition</span>
          <span></span>
        </div>
      )}

      {crops.map((crop) => (
        <div key={crop.id} className="crops-table__row">
          <input
            className="input"
            type="text"
            placeholder="e.g. Maize"
            value={crop.name}
            onChange={(e) => updateRow(crop.id, "name", e.target.value)}
            aria-label="Crop name"
          />
          <input
            className="input"
            type="number"
            min={0}
            placeholder="0"
            value={crop.quantity || ""}
            onChange={(e) => updateRow(crop.id, "quantity", Number(e.target.value))}
            aria-label="Quantity"
          />
          <input
            className="input"
            type="text"
            placeholder="kg / bags / trees"
            value={crop.unit}
            onChange={(e) => updateRow(crop.id, "unit", e.target.value)}
            aria-label="Unit"
          />
          <select
            className="input"
            value={crop.condition}
            onChange={(e) => updateRow(crop.id, "condition", e.target.value)}
            aria-label="Crop condition"
          >
            <option value="">Select…</option>
            {CROP_CONDITIONS.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <button
            type="button"
            className="btn btn--danger btn--icon"
            onClick={() => removeRow(crop.id)}
            aria-label="Remove crop"
          >
            🗑
          </button>
        </div>
      ))}

      <button type="button" className="btn btn--outline btn--sm" onClick={addRow}>
        + Add Crop / Tree
      </button>
    </div>
  );
};
