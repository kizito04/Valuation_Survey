// ============================================================
// Image Helper Utilities
// ============================================================

/**
 * Convert a File object to a base64 data URL string
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

/**
 * Convert base64 data URL to a Blob
 */
export function base64ToBlob(base64: string): Blob {
  const [header, data] = base64.split(",");
  const mime = header.match(/:(.*?);/)?.[1] ?? "image/jpeg";
  const binary = atob(data);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new Blob([bytes], { type: mime });
}

/**
 * Estimate total photo storage size in MB for a survey record object
 */
export function estimatePhotoSizeMB(obj: unknown): number {
  const json = JSON.stringify(obj);
  // base64 strings are ~4/3 the size of binary; rough estimate from JSON length
  const bytes = new TextEncoder().encode(json).length;
  return bytes / (1024 * 1024);
}

/**
 * Compress / resize a base64 image using an off-screen canvas
 * maxWidth: target max width in pixels (default 1200)
 * quality: JPEG quality 0–1 (default 0.75)
 */
export function compressBase64(
  base64: string,
  maxWidth = 1200,
  quality = 0.75
): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, maxWidth / img.width);
      const canvas = document.createElement("canvas");
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL("image/jpeg", quality));
    };
    img.src = base64;
  });
}
