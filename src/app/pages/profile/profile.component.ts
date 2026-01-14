import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { User } from '../../models/models';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
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
    private subscriptionService: SubscriptionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const currentUser = this.authService.currentUserValue;

    if (!currentUser || !currentUser.id) {
      this.router.navigate(['/login']);
      return;
    }

    this.userService.getUserById(currentUser.id).subscribe({
      next: (userData: User) => {
        this.user = userData;
        if (currentUser.token) this.user.token = currentUser.token;

        if (this.user.roleId) {
          this.roleService.getRoleById(this.user.roleId).subscribe(r => { if(this.user) this.user.role = r; });
        }
        if (this.user.subscriptionId) {
          this.subscriptionService.getSubscriptionById(this.user.subscriptionId).subscribe(s => { if(this.user) this.user.subscription = s; });
        }
      },
      error: (err) => {
        console.error(err);
        this.router.navigate(['/login']);
      }
    });
  }

  saveChanges() {
    if (this.user && this.user.id) {
      this.userService.editUser(this.user.id, this.user).subscribe({
        next: () => alert('Salvat!'),
        error: () => alert('Eroare!')
      });
    }
  }
}