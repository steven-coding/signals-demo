import { Injectable } from '@angular/core';
import { ImageData } from '../interfaces/image-data.interface';
import { DataGenerator } from './image-data.service';

@Injectable({
  providedIn: 'root'
})
export class DataGeneratorService implements DataGenerator {
  generateSampleData(width: number, height: number): ImageData {
    const rows = [];
    for (let y = 0; y < height; y++) {
      let row = '';
      for (let x = 0; x < width; x++) {
        const color = this.generateRandomColor();
        const hex = color.substring(1); // Remove #
        row += hex;
      }
      rows.push(row);
    }
    return { data: rows.join('\n') };
  }

  generateRandomColor(): string {
    const r = Math.floor(Math.random() * 256).toString(16).padStart(2, '0');
    const g = Math.floor(Math.random() * 256).toString(16).padStart(2, '0');
    const b = Math.floor(Math.random() * 256).toString(16).padStart(2, '0');
    return `#${r}${g}${b}`;
  }
}