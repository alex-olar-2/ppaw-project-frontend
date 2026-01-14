import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http'; // Import important
import { authInterceptor } from './interceptors/auth.interceptor'; // Importă interceptorul

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    // Aici adăugăm interceptorul
    provideHttpClient(withInterceptors([authInterceptor])) 
  ]
};