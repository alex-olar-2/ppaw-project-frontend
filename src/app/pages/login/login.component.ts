import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  rememberMe: boolean = false;

  constructor(private router: Router) {}

  onSubmit(): void {
    console.log('Login attempt:', { email: this.email, password: this.password });
    // Navigate to dashboard after login
    this.router.navigate(['/dashboard']);
  }

  onForgotPassword(): void {
    console.log('Forgot password clicked');
  }
}