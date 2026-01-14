import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UseService } from '../../services/use.service';
import { Use, User } from '../../models/models';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  currentUser: User | null = null;
  uses: Use[] = [];
  loading: boolean = true;
  stats = { totalUses: 0, successful: 0, failed: 0, lastActivity: 'N/A' };

  constructor(
    private router: Router,
    private useService: UseService,
    private authService: AuthService
  ) {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (this.currentUser) this.loadUses();
    });
  }

  ngOnInit(): void {
    if (this.authService.currentUserValue) {
        this.currentUser = this.authService.currentUserValue;
        this.loadUses();
    }
  }

  loadUses(): void {
    if (!this.currentUser || !this.currentUser.id) return;
    this.loading = true;
    
    this.useService.getUsesByUserId(this.currentUser.id).subscribe({
      next: (data: Use[]) => {
        this.uses = data;
        this.calculateStats();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading uses:', err);
        this.loading = false;
      }
    });
  }

  calculateStats(): void {
    if (!this.uses) return;
    this.stats.totalUses = this.uses.length;
    this.stats.successful = this.uses.filter(u => u.isSucceeded).length;
    this.stats.failed = this.stats.totalUses - this.stats.successful;
    if (this.uses.length > 0) {
      const lastDate = new Date(this.uses[0].createdAt);
      this.stats.lastActivity = lastDate.toLocaleDateString() + ' ' + lastDate.toLocaleTimeString();
    }
  }

  navigateToUpload(): void { this.router.navigate(['/upload']); }
  
  onLogout(): void { this.authService.logout(); }

  deleteUse(use: Use): void {
    if(confirm('Ștergi înregistrarea?')) {
      this.useService.deleteUseById(use.id).subscribe({
        next: () => {
          this.uses = this.uses.filter(u => u.id !== use.id);
          this.calculateStats();
        },
        error: (err) => console.error(err)
      });
    }
  }
}