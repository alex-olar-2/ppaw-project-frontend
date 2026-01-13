import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
// Asigură-te că calea este corectă către models
import { User, Role, Subscription } from '../../models/models'; 

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  // Inițializăm un user dummy care respectă interfața din models.ts
  user: User = {
    id: '123-abc-456',
    isVisible: true,
    email: 'user@company.com',
    cui: 'RO12345678', // Câmp specific din modelul tău
    subscriptionId: 'sub-premium',
    roleId: 'role-admin',
    // Obiectele asociate (populate de obicei din backend)
    role: {
      id: 'role-admin',
      isVisible: true,
      name: 'Administrator',
      isDefault: false
    },
    subscription: {
      id: 'sub-premium',
      isVisible: true,
      name: 'Gold Plan',
      price: 99.99,
      isDefault: false
    }
  };
  
  // Metode dummy pentru salvare
  saveChanges() {
    console.log('Salvare date user:', this.user);
  }
}