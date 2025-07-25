import { Component, ElementRef, ViewChild, OnInit, OnDestroy, AfterViewInit, inject, computed, effect } from '@angular/core';
import { CanvasConfigService } from '../../services/canvas-config.service';

@Component({
  selector: 'app-source-image-canvas',
  standalone: true,
  imports: [],
  templateUrl: './source-image-canvas.component.html',
  styleUrl: './source-image-canvas.component.scss'
})
export class SourceImageCanvasComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('canvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;
  private canvasConfig = inject(CanvasConfigService);
  private ctx!: CanvasRenderingContext2D;
  private animationInterval?: number;

  ngOnInit() {
    this.ctx = this.canvas.nativeElement.getContext('2d')!;
    this.setupCanvas();
    this.startAnimation();
  }

  ngAfterViewInit() {
    // Update canvas size when configuration changes
    effect(() => {
      const config = this.canvasConfig.config();
      if (this.canvas?.nativeElement && this.ctx) {
        this.setupCanvas();
      }
    });
  }

  private setupCanvas() {
    const config = this.canvasConfig.config();
    const dpr = window.devicePixelRatio || 1;
    
    // Set canvas internal resolution accounting for device pixel ratio
    this.canvas.nativeElement.width = config.width * dpr;
    this.canvas.nativeElement.height = config.height * dpr;
    
    // Set canvas display size to exact pixel dimensions
    this.canvas.nativeElement.style.width = `${config.width}px`;
    this.canvas.nativeElement.style.height = `${config.height}px`;
    this.canvas.nativeElement.style.imageRendering = 'pixelated';
    
    // Reset transform and scale the drawing context to account for device pixel ratio
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.scale(dpr, dpr);
  }

  private startAnimation() {
    this.generateAndDrawData();
    
    // Generate new data every 100ms for animation
    this.animationInterval = window.setInterval(() => {
      if (this.canvasConfig.isAnimating()) {
        this.generateAndDrawData();
      }
    }, 100);
  }

  private generateAndDrawData() {
    this.canvasConfig.generateNewPixelStates();
    this.drawCanvasFromPixelStates();
  }

  private drawCanvasFromPixelStates() {
    const config = this.canvasConfig.config();
    const pixelStates = this.canvasConfig.pixelStates();
    
    // Clear the canvas first
    this.ctx.clearRect(0, 0, config.width, config.height);
    
    // Draw each pixel as a 1x1 rectangle
    for (let i = 0; i < pixelStates.length; i++) {
      const pixel = pixelStates[i];
      this.ctx.fillStyle = pixel.color;
      this.ctx.fillRect(pixel.x, pixel.y, 1, 1);
    }
  }

  ngOnDestroy() {
    if (this.animationInterval) {
      clearInterval(this.animationInterval);
    }
  }
}
