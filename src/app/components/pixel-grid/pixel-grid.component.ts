import { Component, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PixelRowComponent } from '../pixel-row/pixel-row.component';
import { CanvasConfigService } from '../../services/canvas-config.service';

@Component({
  selector: 'app-pixel-grid',
  standalone: true,
  imports: [CommonModule, PixelRowComponent],
  templateUrl: './pixel-grid.component.html',
  styleUrl: './pixel-grid.component.scss'
})
export class PixelGridComponent implements OnInit {
  private canvasConfig = inject(CanvasConfigService);
  
  rows: Array<{rowIndex: number}> = [];

  ngOnInit() {
    this.generateRows();
  }

  private generateRows() {
    const config = this.canvasConfig.config();
    
    this.rows = [];
    for (let i = 0; i < config.height; i++) {
      this.rows.push({ rowIndex: i });
    }
  }

  // Regenerate rows when config changes
  configChanged = computed(() => {
    const config = this.canvasConfig.config();
    this.generateRows();
    return config;
  });

  trackRow(index: number, row: {rowIndex: number}): number {
    return row.rowIndex;
  }
}
