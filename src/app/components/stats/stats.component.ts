import { Component, OnInit, OnDestroy, ElementRef } from '@angular/core';
import Stats from 'stats.js';

@Component({
  selector: 'app-stats',
  standalone: true,
  template: '',
  styles: [`
    :host {
      position: fixed;
      top: 0;
      left: 0;
      z-index: 10000;
    }
  `]
})
export class StatsComponent implements OnInit, OnDestroy {
  private stats!: Stats;
  private animationFrameId!: number;

  constructor(private elementRef: ElementRef) {}

  ngOnInit() {
    this.stats = new Stats();
    this.stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
    this.elementRef.nativeElement.appendChild(this.stats.dom);
    
    this.animate();
  }

  ngOnDestroy() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }

  private animate = () => {
    this.stats.begin();
    
    // monitored code goes here
    
    this.stats.end();
    this.animationFrameId = requestAnimationFrame(this.animate);
  }
}