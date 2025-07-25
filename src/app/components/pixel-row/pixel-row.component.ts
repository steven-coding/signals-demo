import { Component, Input, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PixelGroupComponent } from '../pixel-group/pixel-group.component';
import { CanvasConfigService } from '../../services/canvas-config.service';

@Component({
  selector: 'app-pixel-row',
  standalone: true,
  imports: [CommonModule, PixelGroupComponent],
  templateUrl: './pixel-row.component.html',
  styleUrl: './pixel-row.component.scss'
})
export class PixelRowComponent implements OnInit {
  @Input() rowIndex!: number;
  
  private canvasConfig = inject(CanvasConfigService);
  
  groups: Array<{groupIndex: number}> = [];

  ngOnInit() {
    this.generateGroups();
  }

  private generateGroups() {
    const config = this.canvasConfig.config();
    const groupsPerRow = Math.ceil(config.width / config.groupSize);
    
    this.groups = [];
    for (let i = 0; i < groupsPerRow; i++) {
      this.groups.push({ groupIndex: i });
    }
  }

  // Regenerate groups when config changes
  configChanged = computed(() => {
    const config = this.canvasConfig.config();
    this.generateGroups();
    return config;
  });

  trackGroup(index: number, group: {groupIndex: number}): number {
    return group.groupIndex;
  }
}
