import { Component, Input, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PixelComponent } from '../pixel/pixel.component';
import { CanvasConfigService } from '../../services/canvas-config.service';

@Component({
  selector: 'app-pixel-group',
  standalone: true,
  imports: [CommonModule, PixelComponent],
  templateUrl: './pixel-group.component.html',
  styleUrl: './pixel-group.component.scss'
})
export class PixelGroupComponent implements OnInit {
  @Input() rowIndex!: number;
  @Input() groupIndex!: number;
  
  private canvasConfig = inject(CanvasConfigService);
  
  pixels: Array<{x: number, y: number}> = [];

  ngOnInit() {
    this.generatePixelPositions();
  }

  private generatePixelPositions() {
    const config = this.canvasConfig.config();
    const pixelsPerGroup = config.groupSize;
    const startX = this.groupIndex * pixelsPerGroup;
    const y = this.rowIndex;
    
    this.pixels = [];
    for (let i = 0; i < pixelsPerGroup && startX + i < config.width; i++) {
      this.pixels.push({
        x: startX + i,
        y: y
      });
    }
  }

  // Regenerate pixels when config changes
  configChanged = computed(() => {
    const config = this.canvasConfig.config();
    this.generatePixelPositions();
    return config;
  });

  trackPixel(index: number, pixel: {x: number, y: number}): string {
    return `${pixel.x}-${pixel.y}`;
  }
}
