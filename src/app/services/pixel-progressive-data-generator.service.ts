import { Injectable } from '@angular/core';
import { ImageData } from '../interfaces/image-data.interface';
import { DataGenerator } from './image-data.service';

interface PixelProgressiveState {
  baseColor: string;
  targetColor: string;
  currentRow: number;
  currentCol: number;
  maxRows: number;
  maxCols: number;
  isComplete: boolean;
  cachedImageData?: string;
  lastGeneratedPixel?: { row: number; col: number };
}

@Injectable({
  providedIn: 'root'
})
export class PixelProgressiveDataGeneratorService implements DataGenerator {
  private currentState: PixelProgressiveState | null = null;
  private animationStep = 0;

  generateSampleData(width: number, height: number): ImageData {
    this.animationStep++;
    
    // Initialize or update progressive state
    if (!this.currentState || this.currentState.isComplete) {
      this.initializeNewProgression(width, height);
      this.generateCachedImageData(width, height);
    }
    
    if (this.currentState && !this.currentState.isComplete) {
      // Progress to next pixel (left to right, top to bottom)
      this.currentState.currentCol++;
      
      // If we've reached the end of the row, move to next row
      if (this.currentState.currentCol >= width) {
        this.currentState.currentCol = 0;
        this.currentState.currentRow++;
        
        // Check if we've completed all rows
        if (this.currentState.currentRow >= height) {
          this.currentState.isComplete = true;
        }
      }
      
      // Update cached data only if pixel position changed
      const currentPixel = { row: this.currentState.currentRow, col: this.currentState.currentCol };
      const lastPixel = this.currentState.lastGeneratedPixel;
      
      if (!lastPixel || lastPixel.row !== currentPixel.row || lastPixel.col !== currentPixel.col) {
        this.generateCachedImageData(width, height);
        this.currentState.lastGeneratedPixel = { ...currentPixel };
      }
    }

    return { data: this.currentState?.cachedImageData || '' };
  }

  generateRandomColor(): string {
    // Return the current target color
    return this.currentState?.targetColor || '#ff0000';
  }

  private generateCachedImageData(width: number, height: number): void {
    if (!this.currentState) return;
    
    const rows = [];
    
    for (let y = 0; y < height; y++) {
      let row = '';
      for (let x = 0; x < width; x++) {
        const pixelColor = this.getPixelColor(x, y, width, height);
        const hex = pixelColor.substring(1); // Remove #
        row += hex;
      }
      rows.push(row);
    }

    this.currentState.cachedImageData = rows.join('\n');
  }

  private getPixelColor(x: number, y: number, width: number, height: number): string {
    if (!this.currentState) {
      return '#888888'; // Default color
    }

    // If progression is complete, entire image is target color
    if (this.currentState.isComplete) {
      return this.currentState.targetColor;
    }

    // Check if this pixel has been converted
    if (y < this.currentState.currentRow) {
      // Entire previous rows are converted
      return this.currentState.targetColor;
    } else if (y === this.currentState.currentRow) {
      // Current row: check if this pixel position has been reached
      if (x < this.currentState.currentCol) {
        return this.currentState.targetColor;
      }
    }
    
    // Pixel hasn't been converted yet
    return this.currentState.baseColor;
  }

  private initializeNewProgression(width: number, height: number): void {
    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ff8800', '#8800ff'];
    
    // If we had a previous state, the base color becomes the previous target color
    const baseColor = this.currentState?.targetColor || '#888888';
    
    // Pick a new target color (different from base color)
    let targetColor;
    do {
      targetColor = colors[Math.floor(Math.random() * colors.length)];
    } while (targetColor === baseColor);

    this.currentState = {
      baseColor,
      targetColor,
      currentRow: 0,
      currentCol: 0,
      maxRows: height,
      maxCols: width,
      isComplete: false,
      cachedImageData: undefined,
      lastGeneratedPixel: undefined
    };
  }
}