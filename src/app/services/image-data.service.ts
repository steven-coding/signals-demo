import { Injectable, inject, signal, computed } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { ImageData } from '../interfaces/image-data.interface';
import { CanvasConfigService, PixelState } from './canvas-config.service';
import { DATA_GENERATOR_TOKEN } from '../tokens/data-generator.token';

export interface DataGenerator {
  generateSampleData(width: number, height: number): ImageData;
  generateRandomColor(): string;
}

@Injectable({
  providedIn: 'root'
})
export class ImageDataService {
  private canvasConfig = inject(CanvasConfigService);
  private dataGenerator = inject(DATA_GENERATOR_TOKEN);
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
    return this.dataGenerator.generateSampleData(width, height);
  }
}
