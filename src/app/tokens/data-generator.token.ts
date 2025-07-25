import { InjectionToken } from '@angular/core';
import { DataGenerator } from '../services/image-data.service';

export const DATA_GENERATOR_TOKEN = new InjectionToken<DataGenerator>('DataGenerator');