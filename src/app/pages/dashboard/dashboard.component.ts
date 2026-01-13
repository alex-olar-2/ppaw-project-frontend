import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UseService } from '../../services/use.service';
import { Use } from '../../models/models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  uses: Use[] = [];
  loading: boolean = true;

  // Statistici calculate pe baza datelor reale
  stats = {
    totalUses: 0,
    successful: 0,
    failed: 0,
    lastActivity: 'N/A'
  };

  // NOTĂ: Într-o aplicație reală, acest ID ar trebui să vină din AuthService
  // Aici îl luăm din localStorage sau folosim un placeholder pentru testare
  currentUserId: string = localStorage.getItem('userId') || 'user-id-placeholder';

  constructor(
    private router: Router,
    private useService: UseService
  ) {}

  ngOnInit(): void {
    this.loadUses();
  }

  loadUses(): void {
    this.loading = true;
    // Apelăm serviciul pentru a lua utilizările user-ului curent
    // Presupunem că backend-ul returnează o listă de Use-uri
    // (Folosim 'any' aici pentru a evita erorile de tipare dacă definiția serviciului este singulară)
    (this.useService.getUseByUserId(this.currentUserId) as any).subscribe({
      next: (data: Use[] | Use) => {
        // Asigurăm compatibilitatea fie că vine un array, fie un singur obiect
        this.uses = Array.isArray(data) ? data : (data ? [data] : []);
        this.calculateStats();
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Error loading uses:', err);
        this.loading = false;
      }
    });
  }

  calculateStats(): void {
    this.stats.totalUses = this.uses.length;
    this.stats.successful = this.uses.filter(u => u.isSucceeded).length;
    this.stats.failed = this.stats.totalUses - this.stats.successful;
    
    // Setăm data ultimei activități
    if (this.uses.length > 0) {
      // Sortăm descrescător după dată pentru a găsi ultima activitate
      const sorted = [...this.uses].sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      this.stats.lastActivity = new Date(sorted[0].createdAt).toLocaleDateString();
    } else {
      this.stats.lastActivity = '-';
    }
  }

  navigateToUpload(): void {
    this.router.navigate(['/upload']);
  }

  viewUse(use: Use): void {
    console.log('View use details:', use);
    // Implementare viitoare: navigare către detalii
  }

  deleteUse(use: Use): void {
    if(confirm('Sigur dorești să ștergi această înregistrare?')) {
      this.useService.deleteUseById(use.id).subscribe({
        next: () => {
          this.uses = this.uses.filter(u => u.id !== use.id);
          this.calculateStats();
        },
        error: (err) => console.error('Error deleting use:', err)
      });
    }
  }

  logout(): void {
    localStorage.removeItem('userId'); // Curățăm sesiunea simulată
    this.router.navigate(['/login']);
  }

  profile(): void {
    this.router.navigate(['/profile']);
  }

  subscriptions(): void {
    this.router.navigate(['/subscriptions']);
  }
}