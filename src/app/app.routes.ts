// src/app/app.routes.ts

import { Routes } from '@angular/router';

// Asigură-te că folosești numele corecte de import, presupunând că ai fișiere .ts (ex: LoginComponent)
// Dacă ai redenumit componentele tale în fișierele lor (ex: class Login {...}),
// folosește importurile corespunzătoare.

// Importurile tale actuale (pe care le voi folosi):
import { Login } from './auth/login/login';
import { Signup } from './auth/signup/signup';
import { PdfUpload } from './dashboard/pdf-upload/pdf-upload';
import { Dashboard } from './dashboard/dashboard/dashboard';
import { Subscriptions } from './dashboard/subscriptions/subscriptions';
import { Usage } from './dashboard/usage/usage';
import { Profile } from './dashboard/profile/profile';


export const routes: Routes = [
  // Rutele de autentificare
  { path: 'login', component: Login },
  { path: 'signup', component: Signup },

  // Rutele protejate (Dashboard-ul)
  {
    path: 'dashboard',
    component: Dashboard,
    children: [
      { path: '', redirectTo: 'upload', pathMatch: 'full' },
      { path: 'upload', component: PdfUpload },
      { path: 'subscriptions', component: Subscriptions },
      { path: 'usage', component: Usage },
      { path: 'profile', component: Profile },
    ],
  },

  // Ruta implicită redirecționează către login
  { path: '', redirectTo: '/login', pathMatch: 'full' },

  // Pagină 404
  { path: '**', redirectTo: '/login' },
];