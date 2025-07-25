import { Injectable, signal, inject } from '@angular/core';
import { DATA_GENERATOR_TOKEN } from '../tokens/data-generator.token';

export interface CanvasConfig {
  width: number;
  height: number;
  groupSize: number;
}

export interface PixelState {
  x: number;
  y: number;
  color: string;
}

@Injectable({
  providedIn: 'root'
})
export class CanvasConfigService {
  private dataGenerator = inject(DATA_GENERATOR_TOKEN);
  private configSignal = signal<CanvasConfig>({ width: 50, height: 50, groupSize: 10 });
  private pixelStatesSignal = signal<PixelState[]>([]);
  private isAnimatingSignal = signal<boolean>(true);
  
  public config = this.configSignal.asReadonly();
  public pixelStates = this.pixelStatesSignal.asReadonly();
  public isAnimating = this.isAnimatingSignal.asReadonly();

  updateConfig(config: CanvasConfig) {
    this.configSignal.set(config);
    this.initializePixelStates();
  }

  updatePixelStates(states: PixelState[]) {
    this.pixelStatesSignal.set(states);
  }

  private initializePixelStates() {
    const config = this.configSignal();
    const imageData = this.dataGenerator.generateSampleData(config.width, config.height);
    const states: PixelState[] = [];
    
    const rows = imageData.data.split('\n');
    for (let y = 0; y < config.height; y++) {
      const row = rows[y] || '';
      for (let x = 0; x < config.width; x++) {
        const colorHex = row.substring(x * 6, (x + 1) * 6);
        const color = colorHex.length === 6 ? `#${colorHex}` : this.dataGenerator.generateRandomColor();
        
        states.push({
          x,
          y,
          color
        });
      }
    }
    
    this.pixelStatesSignal.set(states);
  }

  generateNewPixelStates() {
    const config = this.configSignal();
    const imageData = this.dataGenerator.generateSampleData(config.width, config.height);
    const states: PixelState[] = [];
    
    const rows = imageData.data.split('\n');
    for (let y = 0; y < config.height; y++) {
      const row = rows[y] || '';
      for (let x = 0; x < config.width; x++) {
        const colorHex = row.substring(x * 6, (x + 1) * 6);
        const color = colorHex.length === 6 ? `#${colorHex}` : this.dataGenerator.generateRandomColor();
        
        states.push({
          x,
          y,
          color
        });
      }
    }
    
    this.pixelStatesSignal.set(states);
  }


  getPixelAtPosition(x: number, y: number): PixelState | undefined {
    const config = this.configSignal();
    const index = y * config.width + x;
    return this.pixelStatesSignal()[index];
  }

  startAnimation() {
    this.isAnimatingSignal.set(true);
  }

  stopAnimation() {
    this.isAnimatingSignal.set(false);
  }

  toggleAnimation() {
    this.isAnimatingSignal.set(!this.isAnimatingSignal());
  }
}
