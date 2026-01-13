import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  firstName = 'John';
  lastName = 'Doe';
  email = 'john.doe@example.com';
  phone = '+1 234 567 8900';
  bio = 'Software developer passionate about creating efficient solutions.';
  currentPassword = '';
  newPassword = '';
  confirmPassword = '';
  twoFactorEnabled = false;
  emailNotifications = true;
  uploadNotifications = true;
  marketingNotifications = false;
}