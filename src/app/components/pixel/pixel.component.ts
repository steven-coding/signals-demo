import { Component, Input, computed, signal, inject } from '@angular/core';
import { CanvasConfigService, PixelState } from '../../services/canvas-config.service';

@Component({
  selector: 'app-pixel',
  standalone: true,
  imports: [],
  templateUrl: './pixel.component.html',
  styleUrl: './pixel.component.scss'
})
export class PixelComponent {
  @Input() x!: number;
  @Input() y!: number;
  
  private canvasConfig = inject(CanvasConfigService);
  
  pixelState = computed(() => {
    return this.canvasConfig.getPixelAtPosition(this.x, this.y);
  });

  get backgroundColor(): string {
    const state = this.pixelState();
    return state?.color || '#000000';
  }
}
