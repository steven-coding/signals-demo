import { Injectable, signal } from '@angular/core';
import { ImageData } from '../interfaces/image-data.interface';

@Injectable({
  providedIn: 'root'
})
export class SignalImageDataService {
  private imageDataSignal = signal<ImageData>({ data: '' });
  public imageData = this.imageDataSignal.asReadonly();

  updateImageData(data: ImageData) {
    this.imageDataSignal.set(data);
  }

  generateSampleData(width: number, height: number): ImageData {
    const rows = [];
    for (let y = 0; y < height; y++) {
      let row = '';
      for (let x = 0; x < width; x++) {
        // Generate random hex color
        const r = Math.floor(Math.random() * 256).toString(16).padStart(2, '0');
        const g = Math.floor(Math.random() * 256).toString(16).padStart(2, '0');
        const b = Math.floor(Math.random() * 256).toString(16).padStart(2, '0');
        row += r + g + b;
      }
      rows.push(row);
    }
    return { data: rows.join('\n') };
  }
}
