import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UseService } from '../../services/use.service';
//
import { IdentityCardService } from '../../services/identity-card.service'; // Importă serviciul
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
    private identityCardService: IdentityCardService, // Injectăm serviciul aici
    private authService: AuthService
  ) {
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
        
        // --- LOGICA NOUĂ: Iterăm și populăm datele despre buletin ---
        this.uses.forEach(use => {
          // Verificăm dacă există un ID de buletin dar obiectul identityCard lipsește
          if (use.identityCardId && !use.identityCard) {
             this.identityCardService.getIdentityCardById(use.identityCardId).subscribe({
               next: (card) => {
                 // Atribuim rezultatul în obiectul use curent
                 use.identityCard = card;
               },
               error: (err) => console.error(`Nu s-a putut încărca buletinul ${use.identityCardId}`, err)
             });
          }
        });
        // ------------------------------------------------------------

        this.calculateStats();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading uses:', err);
        this.loading = false;
      }
    });
  }

  // Restul metodelor (calculateStats, navigateToUpload, onLogout, deleteUse) rămân neschimbate
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