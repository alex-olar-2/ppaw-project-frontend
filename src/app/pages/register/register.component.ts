import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service';
import { RoleService } from '../../services/role.service';
import { SubscriptionService } from '../../services/subscription.service';
import { AuthService } from '../../services/auth.service'; // Import AuthService

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {
  registerData = {
    email: '',
    password: '',
    confirmPassword: '',
    cui: ''
  };

  private defaultRoleId: string = '';
  private defaultSubscriptionId: string = '';
  errorMessage: string = '';

  constructor(
    private userService: UserService,
    private roleService: RoleService,
    private subscriptionService: SubscriptionService,
    private authService: AuthService, // Injectăm AuthService
    private router: Router
  ) {}

  ngOnInit(): void {
    this.roleService.getDefaultRole().subscribe({
      next: (role) => { if (role) this.defaultRoleId = role.id; },
      error: (err) => console.error('Error fetching default role', err)
    });

    this.subscriptionService.getDefaultSubscription().subscribe({
      next: (sub) => { if (sub) this.defaultSubscriptionId = sub.id; },
      error: (err) => console.error('Error fetching default subscription', err)
    });
  }

  onSubmit(): void {
    if (this.registerData.password !== this.registerData.confirmPassword) {
      this.errorMessage = 'Parolele nu coincid!';
      return;
    }

    const newUser = {
      email: this.registerData.email,
      password: this.registerData.password,
      cui: this.registerData.cui,
      roleId: this.defaultRoleId,
      subscriptionId: this.defaultSubscriptionId
    };

    // 1. Creăm utilizatorul
    this.userService.addUser(newUser).subscribe({
      next: () => {
        console.log('User created successfully. Attempting auto-login...');
        
        // 2. Facem Auto-Login pentru a obține datele complete (ID, etc.)
        this.userService.login(newUser.email, newUser.password).subscribe({
          next: (user) => {
             // 3. Salvăm userul în sesiune (AuthService)
             this.authService.login(user);
             // 4. Redirecționăm către dashboard
             this.router.navigate(['/dashboard']);
          },
          error: (err) => {
            console.error('Auto-login failed', err);
            // Dacă auto-login eșuează, trimitem utilizatorul la pagina de login manual
            this.router.navigate(['/login']);
          }
        });
      },
      error: (err) => {
        console.error('Registration failed', err);
        this.errorMessage = 'A apărut o eroare la înregistrare.';
      }
    });
  }
}