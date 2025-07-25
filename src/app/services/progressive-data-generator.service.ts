import { Injectable } from '@angular/core';
import { ImageData } from '../interfaces/image-data.interface';
import { DataGenerator } from './image-data.service';

interface ProgressiveState {
  baseColor: string;
  targetColor: string;
  currentRow: number;
  maxRows: number;
  isComplete: boolean;
  cachedImageData?: string;
  lastGeneratedRow?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProgressiveDataGeneratorService implements DataGenerator {
  private currentState: ProgressiveState | null = null;
  private animationStep = 0;

  generateSampleData(width: number, height: number): ImageData {
    this.animationStep++;
    
    // Initialize or update progressive state
    if (!this.currentState || this.currentState.isComplete) {
      this.initializeNewProgression(height);
      this.generateCachedImageData(width, height);
    }
    
    if (this.currentState && !this.currentState.isComplete) {
      // Progress to next row
      this.currentState.currentRow++;
      
      if (this.currentState.currentRow >= height) {
        this.currentState.isComplete = true;
      }
      
      // Update cached data only if row changed
      if (this.currentState.lastGeneratedRow !== this.currentState.currentRow) {
        this.generateCachedImageData(width, height);
        this.currentState.lastGeneratedRow = this.currentState.currentRow;
      }
    }

    return { data: this.currentState?.cachedImageData || '' };
  }

  generateRandomColor(): string {
    // Return the current target color
    return this.currentState?.targetColor || '#ff0000';
  }

  private getRowColor(y: number, height: number): string {
    if (!this.currentState) {
      return '#888888'; // Default color
    }

    // If progression is complete, entire image is target color
    if (this.currentState.isComplete || this.currentState.currentRow >= height) {
      return this.currentState.targetColor;
    }

    // If this row has been converted, use target color
    if (y < this.currentState.currentRow) {
      return this.currentState.targetColor;
    }
    
    // Otherwise use base color
    return this.currentState.baseColor;
  }

  private generateCachedImageData(width: number, height: number): void {
    if (!this.currentState) return;
    
    const rows = [];
    
    // Performance optimization: generate entire rows at once since each row has uniform color
    for (let y = 0; y < height; y++) {
      const rowColor = this.getRowColor(y, height);
      const hex = rowColor.substring(1); // Remove #
      const row = hex.repeat(width); // Repeat hex color for entire row width
      rows.push(row);
    }

    this.currentState.cachedImageData = rows.join('\n');
  }

  private getPixelColor(x: number, y: number, width: number, height: number): string {
    return this.getRowColor(y, height);
  }

  private initializeNewProgression(height: number): void {
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
      maxRows: height,
      isComplete: false,
      cachedImageData: undefined,
      lastGeneratedRow: undefined
    };
  }
}