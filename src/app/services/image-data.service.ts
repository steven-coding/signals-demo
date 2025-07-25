import { Injectable, inject, signal, computed } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { ImageData } from '../interfaces/image-data.interface';
import { CanvasConfigService, PixelState } from './canvas-config.service';

@Injectable({
  providedIn: 'root'
})
export class ImageDataService {
  private canvasConfig = inject(CanvasConfigService);
  private imageDataSubject = new Subject<ImageData>();
  private imageDataSignal = signal<ImageData>({ data: '' });

  // RxJS API for classic components
  public imageData$ = this.imageDataSubject.asObservable();

  // Signals API for signal components
  public imageData = this.imageDataSignal.asReadonly();
  
  public pixelStates = computed(() => {
    return this.canvasConfig.pixelStates();
  });

  get pixelStates$(): Observable<PixelState[]> {
    return new Observable(subscriber => {
      const subscription = setInterval(() => {
        subscriber.next(this.canvasConfig.pixelStates());
      }, 16);
      return () => clearInterval(subscription);
    });
  }

  get pixelStatesSync(): PixelState[] {
    return this.canvasConfig.pixelStates();
  }

  updateImageData(data: ImageData) {
    this.imageDataSubject.next(data);
    this.imageDataSignal.set(data);
  }

  generateNewImageData() {
    const config = this.canvasConfig.config();
    this.canvasConfig.generateNewPixelStates();
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
