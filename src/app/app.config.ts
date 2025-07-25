import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { DATA_GENERATOR_TOKEN } from './tokens/data-generator.token';
import { DataGeneratorService } from './services/data-generator.service';
import { PatternDataGeneratorService } from './services/pattern-data-generator.service';
import { ProgressiveDataGeneratorService } from './services/progressive-data-generator.service';
import { PixelProgressiveDataGeneratorService } from './services/pixel-progressive-data-generator.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes),
    { provide: DATA_GENERATOR_TOKEN, useClass: PixelProgressiveDataGeneratorService }
  ]
};
