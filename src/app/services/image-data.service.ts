import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ImageData } from '../interfaces/image-data.interface';

@Injectable({
  providedIn: 'root'
})
export class ImageDataService {
  private imageDataSubject = new Subject<ImageData>();
  public imageData$ = this.imageDataSubject.asObservable();

  updateImageData(data: ImageData) {
    this.imageDataSubject.next(data);
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
