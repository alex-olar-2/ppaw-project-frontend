import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subscription, User } from '../../models/models';
import { SubscriptionService } from '../../services/subscription.service';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-subscriptions',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './subscriptions.component.html',
  styleUrl: './subscriptions.component.css'
})
export class SubscriptionsComponent implements OnInit {
  subscriptions: Subscription[] = [];
  currentUser: User | null = null;
  currentSubscriptionId: string | null = null;

  constructor(
    private subscriptionService: SubscriptionService,
    private userService: UserService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Obținem utilizatorul logat (acesta poate avea date incomplete din login, deci îl vom reîncărca)
    const storedUser = this.authService.currentUserValue;
    
    if (storedUser && storedUser.id) {
      // Încărcăm detaliile complete ale utilizatorului pentru a vedea subscriptionId
      this.userService.getUserById(storedUser.id).subscribe({
        next: (user) => {
          this.currentUser = user;
          this.currentSubscriptionId = user.subscriptionId || null;
          this.loadSubscriptions(); // Încărcăm abonamentele după ce știm user-ul
        },
        error: (err) => console.error('Error fetching user details:', err)
      });
    } else {
      this.loadSubscriptions();
    }
  }

  loadSubscriptions(): void {
    this.subscriptionService.getAllSubscriptions().subscribe({
      next: (data) => {
        this.subscriptions = data;
      },
      error: (err) => {
        console.error('Error fetching subscriptions:', err);
      }
    });
  }

  selectPlan(plan: Subscription): void {
    if (!this.currentUser) return;

    if (plan.id === this.currentSubscriptionId) {
      return; // Este deja planul curent
    }

    if (confirm(`Are you sure you want to switch to the ${plan.name} plan?`)) {
      this.userService.editUser(this.currentUser.id, { subscriptionId: plan.id }).subscribe({
        next: () => {
          this.currentSubscriptionId = plan.id;
          alert('Subscription updated successfully!');
          // Opțional: reîncarcă userul sau pagina
        },
        error: (err) => {
          console.error('Error updating subscription:', err);
          alert('Failed to update subscription.');
        }
      });
    }
  }

  // Helper pentru a găsi obiectul abonament curent (pentru afișare în cardul de sus)
  get currentSubscriptionPlan(): Subscription | undefined {
    return this.subscriptions.find(s => s.id === this.currentSubscriptionId);
  }
}