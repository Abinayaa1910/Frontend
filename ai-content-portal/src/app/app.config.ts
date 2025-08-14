// Application-wide configuration including routing, HTTP client, and error handling
import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(), // Handles global browser errors
    provideZoneChangeDetection({ eventCoalescing: true }), // Optimizes change detection
    provideRouter(routes), // Registers app routes
    provideHttpClient() // Enables HTTP requests
  ]
};
