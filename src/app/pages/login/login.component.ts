import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service'; // Import UserService

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
  errorMessage: string = ''; // Pentru afișarea erorilor

  constructor(
    private router: Router, 
    private authService: AuthService,
    private userService: UserService // Injectăm UserService
  ) {}

  onSubmit(): void {
    console.log('Login attempt:', { email: this.email });

    this.userService.login(this.email, this.password).subscribe({
      next: (user) => {
        if (user && user.token) { // Verificăm dacă avem user și token
          this.authService.login(user);
          console.log('Login successful', user);
          this.router.navigate(['/dashboard']);
        } else {
          this.errorMessage = 'Datele primite de la server sunt invalide.';
        }
      },
      error: (err) => {
        console.error('Login error details:', err);
        // Poți verifica statusul erorii
        if (err.status === 401) {
             this.errorMessage = 'Email sau parolă incorectă.';
        } else {
             this.errorMessage = 'A apărut o eroare de conexiune.';
        }
      }
    });
  }

  onForgotPassword(): void {
    console.log('Forgot password clicked');
  }
}