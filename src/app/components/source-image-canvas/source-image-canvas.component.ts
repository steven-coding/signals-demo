import { Component, ElementRef, ViewChild, OnInit, OnDestroy, AfterViewInit, inject, computed, effect } from '@angular/core';
import { CanvasConfigService } from '../../services/canvas-config.service';
import { ImageDataService } from '../../services/image-data.service';

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
  private imageDataService = inject(ImageDataService);
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
    
    // Set canvas internal resolution accounting for device pixel ratio
    this.canvas.nativeElement.width = config.width;
    this.canvas.nativeElement.height = config.height;
    
    // Set canvas display size to exact pixel dimensions
    this.canvas.nativeElement.style.width = `${config.width}px`;
    this.canvas.nativeElement.style.height = `${config.height}px`;
    this.canvas.nativeElement.style.imageRendering = 'pixelated';
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
    this.imageDataService.generateNewImageData();
    this.drawCanvasFromPixelStates();
  }

  private drawCanvasFromPixelStates() {
    const config = this.canvasConfig.config();
    const pixelStates = this.imageDataService.pixelStatesSync;
    
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
