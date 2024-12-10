import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import { MyPreset } from '../../public/mytheme';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: MyPreset,
      },
    }),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
  ],
};
