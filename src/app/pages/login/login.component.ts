import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service'; //
import { User } from '../../models/models'; //

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  rememberMe: boolean = false;

  // Injectăm AuthService
  constructor(private router: Router, private authService: AuthService) {}

  onSubmit(): void {
    console.log('Login attempt:', { email: this.email, password: this.password });

    // AICI AR TREBUI SĂ FIE APELUL CĂTRE BACKEND PENTRU VERIFICARE
    // Simulăm primirea unui utilizator de la backend
    const mockUser: User = {
      id: '1',
      isVisible: true,
      email: this.email,
      subscriptionId: 'sub-free',
      roleId: 'role-user',
      // ... alte câmpuri necesare
    };

    // Stocăm utilizatorul în sesiune folosind serviciul
    this.authService.login(mockUser);

    // Navigăm către dashboard
    this.router.navigate(['/dashboard']);
  }

  onForgotPassword(): void {
    console.log('Forgot password clicked');
  }
}