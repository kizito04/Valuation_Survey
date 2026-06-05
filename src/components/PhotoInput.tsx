// ============================================================
// PhotoInput — Camera capture + base64 preview
// ============================================================
import React, { useRef, useState } from "react";
import { fileToBase64, compressBase64, estimatePhotoSizeMB } from "../utils/imageHelpers";

interface PhotoInputProps {
  label: string;
  previewUrl?: string;
  onCapture: (base64: string | null) => void;
}

export const PhotoInput: React.FC<PhotoInputProps> = ({
  label,
  previewUrl,
  onCapture,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [sizeWarning, setSizeWarning] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setSizeWarning(null);
    try {
      const raw = await fileToBase64(file);
      // Compress before storing
      const compressed = await compressBase64(raw, 1200, 0.75);
      const sizeMB = estimatePhotoSizeMB(compressed);
      if (sizeMB > 2) {
        setSizeWarning(`⚠ Large image (~${sizeMB.toFixed(1)} MB) — may slow sync`);
      }
      onCapture(compressed);
    } catch {
      setSizeWarning("Failed to process image.");
    } finally {
      setIsProcessing(false);
      // Reset input so same file can be re-selected
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const handleRemove = () => {
    onCapture(null);
    setSizeWarning(null);
  };

  return (
    <div className="photo-input">
      <span className="photo-input__label">{label}</span>

      {previewUrl ? (
        <div className="photo-input__preview-wrap">
          <img src={previewUrl} alt={label} className="photo-input__preview" />
          <button
            type="button"
            className="photo-input__remove"
            onClick={handleRemove}
            aria-label="Remove photo"
          >
            ✕
          </button>
        </div>
      ) : (
        <button
          type="button"
          className="photo-input__trigger"
          onClick={() => inputRef.current?.click()}
          disabled={isProcessing}
          aria-label={`Capture ${label}`}
        >
          {isProcessing ? (
            <span className="spinner" />
          ) : (
            <>
              <span className="photo-input__icon">📷</span>
              <span>Take Photo</span>
            </>
          )}
        </button>
      )}

      {sizeWarning && <p className="photo-input__warning">{sizeWarning}</p>}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        style={{ display: "none" }}
        aria-hidden="true"
      />
    </div>
  );
};
