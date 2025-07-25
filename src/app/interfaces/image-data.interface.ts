export interface ImageData {
  data: string; // Raw, line‑break separated
}

export interface ImageRow {
  data: string; // Single row of hex values
}

export interface ImagePixelGroup {
  data: string; // Row segment for a group
}

export interface ImagePixel {
  data: string; // 6‑char hex per pixel
}