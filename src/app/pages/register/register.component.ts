import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service';
import { RoleService } from '../../services/role.service';
import { SubscriptionService } from '../../services/subscription.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css' // Poți crea un fișier css gol sau copia stilurile din login
})
export class RegisterComponent implements OnInit {
  // Model pentru formular
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
    private router: Router
  ) {}

  ngOnInit(): void {
    // Obținem Rolul Implicit
    this.roleService.getDefaultRole().subscribe({
      next: (role) => {
        if (role) this.defaultRoleId = role.id;
      },
      error: (err) => console.error('Error fetching default role', err)
    });

    // Obținem Abonamentul Implicit
    this.subscriptionService.getDefaultSubscription().subscribe({
      next: (sub) => {
        if (sub) this.defaultSubscriptionId = sub.id;
      },
      error: (err) => console.error('Error fetching default subscription', err)
    });
  }

  onSubmit(): void {
    if (this.registerData.password !== this.registerData.confirmPassword) {
      this.errorMessage = 'Parolele nu coincid!';
      return;
    }

    // Construim obiectul utilizator conform UserService
    const newUser = {
      email: this.registerData.email,
      password: this.registerData.password,
      cui: this.registerData.cui,
      roleId: this.defaultRoleId,
      subscriptionId: this.defaultSubscriptionId
    };

    this.userService.addUser(newUser).subscribe({
      next: () => {
        console.log('User created successfully');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Registration failed', err);
        this.errorMessage = 'A apărut o eroare la înregistrare.';
      }
    });
  }
}