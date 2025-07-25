import { Injectable } from '@angular/core';
import { ImageData } from '../interfaces/image-data.interface';
import { DataGenerator } from './image-data.service';

@Injectable({
  providedIn: 'root'
})
export class PatternDataGeneratorService implements DataGenerator {
  generateSampleData(width: number, height: number): ImageData {
    const rows = [];
    for (let y = 0; y < height; y++) {
      let row = '';
      for (let x = 0; x < width; x++) {
        const color = this.generatePatternColor(x, y, width, height);
        const hex = color.substring(1); // Remove #
        row += hex;
      }
      rows.push(row);
    }
    return { data: rows.join('\n') };
  }

  generateRandomColor(): string {
    // Use current time for semi-random but deterministic patterns
    const time = Date.now();
    const r = Math.floor((Math.sin(time * 0.001) * 127) + 128).toString(16).padStart(2, '0');
    const g = Math.floor((Math.cos(time * 0.001) * 127) + 128).toString(16).padStart(2, '0');
    const b = Math.floor((Math.sin(time * 0.002) * 127) + 128).toString(16).padStart(2, '0');
    return `#${r}${g}${b}`;
  }

  private generatePatternColor(x: number, y: number, width: number, height: number): string {
    // Create a checkerboard pattern with gradient colors
    const checkerSize = 8;
    const isCheckerboard = Math.floor(x / checkerSize) % 2 === Math.floor(y / checkerSize) % 2;
    
    if (isCheckerboard) {
      // Gradient from red to blue
      const normalizedX = x / width;
      const r = Math.floor(255 * (1 - normalizedX));
      const g = Math.floor(128 * Math.sin(x * 0.1));
      const b = Math.floor(255 * normalizedX);
      return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    } else {
      // Gradient from green to yellow
      const normalizedY = y / height;
      const r = Math.floor(255 * normalizedY);
      const g = 255;
      const b = Math.floor(128 * Math.cos(y * 0.1));
      return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    }
  }
}