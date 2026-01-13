import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subscription } from '../../models/models'; //
import { SubscriptionService } from '../../services/subscription.service'; //

@Component({
  selector: 'app-subscriptions',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './subscriptions.component.html',
  styleUrl: './subscriptions.component.css'
})
export class SubscriptionsComponent implements OnInit {
  subscriptions: Subscription[] = [];

  constructor(private subscriptionService: SubscriptionService) {}

  ngOnInit(): void {
    this.loadSubscriptions();
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

  // Metodă ajutătoare pentru a afișa facilitățile în funcție de nume (deoarece modelul nu le conține)
  getFeaturesForPlan(planName: string): string[] {
    const name = planName.toLowerCase();
    if (name.includes('free')) {
      return ['5 GB Storage', 'Basic File Upload', 'Basic Support'];
    } else if (name.includes('pro')) {
      return ['100 GB Storage', 'Advanced File Upload', 'Priority Support', 'Advanced Features', 'File Sharing'];
    } else if (name.includes('enterprise')) {
      return ['1 TB Storage', 'Advanced File Upload', '24/7 Premium Support', 'All Features', 'Team Collaboration'];
    }
    return ['Standard Features'];
  }
}