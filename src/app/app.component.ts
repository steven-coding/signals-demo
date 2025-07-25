import { Component, signal, inject, Injector, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SourceImageCanvasComponent } from './components/source-image-canvas/source-image-canvas.component';
import { PixelGridComponent } from './components/pixel-grid/pixel-grid.component';
import { SignalSourceImageCanvasComponent } from './components/signal-source-image-canvas/signal-source-image-canvas.component';
import { SignalPixelGridComponent } from './components/signal-pixel-grid/signal-pixel-grid.component';
import { StatsComponent } from './components/stats/stats.component';
import { CanvasConfigService } from './services/canvas-config.service';
import { MODE_TOKEN } from './tokens/mode.token';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet, 
    SourceImageCanvasComponent, 
    PixelGridComponent,
    SignalSourceImageCanvasComponent,
    SignalPixelGridComponent,
    StatsComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [
    { provide: MODE_TOKEN, useValue: 'classic' } 
  ]
})
export class AppComponent implements OnInit {
  title = 'Signals Demo - Performance Comparison';
  currentMode = signal<'classic' | 'signals'>('classic');
  canvasWidth = signal(50);
  canvasHeight = signal(50);
  pixelGroupSize = signal(10);
  
  // Track pending changes
  pendingWidth = signal(50);
  pendingHeight = signal(50);
  pendingGroupSize = signal(10);
  hasConfigChanges = signal(false);
  
  private injector = inject(Injector);
  private canvasConfig = inject(CanvasConfigService);

  ngOnInit() {
    // Initialize the canvas configuration
    this.applyConfiguration();
  }

  toggleMode() {
    const newMode = this.currentMode() === 'classic' ? 'signals' : 'classic';
    this.currentMode.set(newMode);
  }

  toggleAnimation() {
    this.canvasConfig.toggleAnimation();
  }

  get isAnimating() {
    return this.canvasConfig.isAnimating();
  }

  updateCanvasWidth(event: Event) {
    const target = event.target as HTMLInputElement;
    const newWidth = parseInt(target.value);
    this.pendingWidth.set(newWidth);
    this.checkForConfigChanges();
  }

  updateCanvasHeight(event: Event) {
    const target = event.target as HTMLInputElement;
    const newHeight = parseInt(target.value);
    this.pendingHeight.set(newHeight);
    this.checkForConfigChanges();
  }

  updatePixelGroupSize(event: Event) {
    const target = event.target as HTMLInputElement;
    const newGroupSize = parseInt(target.value);
    this.pendingGroupSize.set(newGroupSize);
    this.checkForConfigChanges();
  }

  private checkForConfigChanges() {
    const hasChanges = 
      this.pendingWidth() !== this.canvasWidth() ||
      this.pendingHeight() !== this.canvasHeight() ||
      this.pendingGroupSize() !== this.pixelGroupSize();
    
    this.hasConfigChanges.set(hasChanges);
  }

  applyConfiguration() {
    // Stop animation
    const wasAnimating = this.canvasConfig.isAnimating();
    this.canvasConfig.stopAnimation();

    // Update actual values
    this.canvasWidth.set(this.pendingWidth());
    this.canvasHeight.set(this.pendingHeight());
    this.pixelGroupSize.set(this.pendingGroupSize());

    // Apply to canvas config service
    this.canvasConfig.updateConfig({
      width: this.canvasWidth(),
      height: this.canvasHeight(),
      groupSize: this.pixelGroupSize()
    });

    // Clear pending changes
    this.hasConfigChanges.set(false);

    // Restart animation after a short delay to allow components to update
    setTimeout(() => {
      if (wasAnimating) {
        this.canvasConfig.startAnimation();
      }
    }, 100);
  }

  get isClassicMode() {
    return this.currentMode() === 'classic';
  }

  get isSignalsMode() {
    return this.currentMode() === 'signals';
  }
}
