import { Injectable, signal } from '@angular/core';

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
    const states: PixelState[] = [];
    
    for (let y = 0; y < config.height; y++) {
      for (let x = 0; x < config.width; x++) {
        states.push({
          x,
          y,
          color: this.generateRandomColor()
        });
      }
    }
    
    this.pixelStatesSignal.set(states);
  }

  generateNewPixelStates() {
    const config = this.configSignal();
    const states: PixelState[] = [];
    
    for (let y = 0; y < config.height; y++) {
      for (let x = 0; x < config.width; x++) {
        states.push({
          x,
          y,
          color: this.generateRandomColor()
        });
      }
    }
    
    this.pixelStatesSignal.set(states);
  }

  private generateRandomColor(): string {
    const r = Math.floor(Math.random() * 256).toString(16).padStart(2, '0');
    const g = Math.floor(Math.random() * 256).toString(16).padStart(2, '0');
    const b = Math.floor(Math.random() * 256).toString(16).padStart(2, '0');
    return `#${r}${g}${b}`;
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
