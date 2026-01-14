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

    // Apelăm metoda de login din UserService
    this.userService.login(this.email, this.password).subscribe({
      next: (user) => {
        if (user) {
          // Salvăm utilizatorul în sesiune (AuthService)
          this.authService.login(user);
          console.log('Login successful', user);
          // Navigăm către dashboard
          this.router.navigate(['/dashboard']);
        } else {
          this.errorMessage = 'Email sau parolă incorectă.';
        }
      },
      error: (err) => {
        console.error('Login error', err);
        this.errorMessage = 'A apărut o eroare la autentificare. Verificați datele.';
      }
    });
  }

  onForgotPassword(): void {
    console.log('Forgot password clicked');
  }
}