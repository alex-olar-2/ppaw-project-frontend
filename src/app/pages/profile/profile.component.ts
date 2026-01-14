import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
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
  isLoading: boolean = true;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private roleService: RoleService,
    private subscriptionService: SubscriptionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const currentUser = this.authService.currentUserValue;

    // 4. Verificăm dacă avem user. Dacă nu, redirecționăm la login.
    if (!currentUser || !currentUser.id) {
      console.warn('Utilizator neautentificat sau ID lipsă. Redirecționare...');
      this.router.navigate(['/login']);
      return;
    }

    this.userService.getUserById(currentUser.id).subscribe({
      next: (userData: User) => {
        this.user = userData;
        // Păstrăm token-ul din sesiunea curentă dacă nu vine de la getById
        if (currentUser.token) {
           this.user.token = currentUser.token; 
        }

        // Încărcare date adiacente (Roluri/Abonamente)
        if (this.user.roleId) {
          this.roleService.getRoleById(this.user.roleId).subscribe({
            next: (roleData) => { if(this.user) this.user.role = roleData; },
            error: (err) => console.error('Eroare rol:', err)
          });
        }

        if (this.user.subscriptionId) {
          this.subscriptionService.getSubscriptionById(this.user.subscriptionId).subscribe({
            next: (subData) => { if(this.user) this.user.subscription = subData; },
            error: (err) => console.error('Eroare abonament:', err)
          });
        }
      },
      error: (err) => {
        console.error('Nu s-au putut încărca datele utilizatorului:', err);
        // Poți afișa un mesaj de eroare sau redirecționa
        alert('Nu s-au putut încărca datele profilului.');
        this.router.navigate(['/login']);
      }
    });
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