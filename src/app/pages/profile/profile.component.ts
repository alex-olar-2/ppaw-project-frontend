import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { User } from '../../models/models';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
// 1. Importăm serviciile necesare
import { RoleService } from '../../services/role.service';
import { SubscriptionService } from '../../services/subscription.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  user: User | null = null;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private roleService: RoleService,
    private subscriptionService: SubscriptionService
  ) {}

  ngOnInit(): void {
    const currentUser = this.authService.currentUserValue;

    if (currentUser && currentUser.id) {
      // 1. Obținem datele proaspete ale utilizatorului (ca să avem roleId și subscriptionId corecte)
      this.userService.getUserById(currentUser.id).subscribe({
        next: (userData: User) => {
          this.user = userData;

          // 2. Dacă utilizatorul are un RoleId, apelăm endpoint-ul de Roluri
          if (this.user.roleId) {
            this.roleService.getRoleById(this.user.roleId).subscribe({
              next: (roleData) => {
                if (this.user) {
                  this.user.role = roleData; // Populăm obiectul Role pentru afișare
                }
              },
              error: (err) => console.error('Nu s-a putut încărca rolul:', err)
            });
          }

          // 3. Dacă utilizatorul are un SubscriptionId, apelăm endpoint-ul de Abonamente
          if (this.user.subscriptionId) {
            this.subscriptionService.getSubscriptionById(this.user.subscriptionId).subscribe({
              next: (subData) => {
                if (this.user) {
                  this.user.subscription = subData; // Populăm obiectul Subscription pentru afișare
                }
              },
              error: (err) => console.error('Nu s-a putut încărca abonamentul:', err)
            });
          }
        },
        error: (err) => {
          console.error('Nu s-au putut încărca datele utilizatorului:', err);
        }
      });
    }
  }
  
  saveChanges() {
    if (this.user && this.user.id) {
      this.userService.editUser(this.user.id, this.user).subscribe({
        next: () => {
          alert('Modificările au fost salvate cu succes!');
        },
        error: (err) => {
          console.error('Eroare la salvare:', err);
          alert('A apărut o eroare la salvarea datelor.');
        }
      });
    }
  }
}