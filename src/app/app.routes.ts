import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { UploadComponent } from './pages/upload/upload.component';
import { SubscriptionsComponent } from './pages/subscriptions/subscriptions.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { RegisterComponent } from './pages/register/register.component';
import { authGuard } from './guards/auth.guard'; // Asigură-te că importul este corect

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  
  // Rute publice (accesibile oricui)
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  // Rute protejate (necesită logare)
  { 
    path: 'subscriptions', 
    component: SubscriptionsComponent, 
    canActivate: [authGuard] 
  },
  { 
    path: 'profile', 
    component: ProfileComponent, 
    canActivate: [authGuard] 
  },
  { 
    path: 'dashboard', 
    component: DashboardComponent, 
    canActivate: [authGuard] 
  },
  { 
    path: 'upload', 
    component: UploadComponent, 
    canActivate: [authGuard] 
  },

  { path: '**', redirectTo: '/login' },
];