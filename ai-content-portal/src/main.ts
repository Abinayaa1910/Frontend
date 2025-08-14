// Entry point for bootstrapping the Angular application
import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { provideRouter, RouteReuseStrategy } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { routes } from './app/app.routes';
import { CustomReuseStrategy } from './app/custom-reuse-strategy';

bootstrapApplication(App, {
  providers: [
    provideRouter(routes),                    // Register routes
    provideHttpClient(),                      // Enable HTTP requests
    importProvidersFrom(FormsModule),         // Enable forms
    { provide: RouteReuseStrategy, useClass: CustomReuseStrategy } // Improve routing reuse
  ]
}).catch(err => console.error(err));
