import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { forkJoin, switchMap, of, throwError } from 'rxjs'; //
import { catchError } from 'rxjs/operators';

// Servicii
import { IdentityDocumentService } from '../../services/identity-document.service';
import { IdentityCardService } from '../../services/identity-card.service';
import { AuthService } from '../../services/auth.service';
import { UseService } from '../../services/use.service';
import { SubscriptionService } from '../../services/subscription.service';
import { UserService } from '../../services/user.service'; //

// Modele
import { IdentityCard } from '../../models/models';

interface UploadedFile {
  name: string;
  size: number;
  status: 'ready' | 'error';
  originalFile: File;
}

// Poți muta asta în models/models.ts
const SUBSCRIPTION_LIMITS: Record<string, number> = {
  'Basic': 3,       // Exemplu: 3 documente pentru contul Free
  'Middle': 10,     // 10 documente pentru Basic
  'Pro': 50,  // 100 (sau nelimitat) pentru Premium
  'Enterprise': 100 
};

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './upload.component.html',
  styleUrl: './upload.component.css'
})
export class UploadComponent {
  uploadedFiles: UploadedFile[] = [];
  isDragging = false;
  isLoading = false;

  constructor(
    private router: Router,
    private identityDocumentService: IdentityDocumentService,
    private identityCardService: IdentityCardService,
    private authService: AuthService,
    private useService: UseService,
    private subscriptionService: SubscriptionService,
    private userService: UserService // [MODIFICARE] Injectăm UserService
  ) {}

  // --- Metode Drag & Drop (Neschimbate) ---
  onDragOver(event: DragEvent): void {
    if (this.isLoading) return;
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
  }

  onDrop(event: DragEvent): void {
    if (this.isLoading) return;
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;

    const files = event.dataTransfer?.files;
    if (files) {
      this.handleFiles(files);
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.handleFiles(input.files);
    }
  }

  handleFiles(files: FileList): void {
    if (files.length > 0) {
      const file = files[0];
      if (file.type === 'application/pdf') {
        this.uploadedFiles = [];
        const uploadedFile: UploadedFile = {
          name: file.name,
          size: file.size,
          status: 'ready',
          originalFile: file
        };
        this.uploadedFiles.push(uploadedFile);
      }
    }
  }

  removeFile(file: UploadedFile): void {
    if (this.isLoading) return;
    const index = this.uploadedFiles.indexOf(file);
    if (index > -1) {
      this.uploadedFiles.splice(index, 1);
    }
  }

  // --- Logica Nouă de Procesare (Chain: User -> Subscription -> Uses) ---

  processFiles(): void {
    if (this.uploadedFiles.length === 0) return;

    this.isLoading = true;

    // 1. Luăm doar ID-ul din sesiunea locală (AuthService)
    const currentUserId = this.authService.currentUserValue?.id;

    if (!currentUserId) {
      console.error('Utilizator neautentificat.');
      this.isLoading = false;
      this.router.navigate(['/login']);
      return;
    }

    // 2. Începem lanțul de apeluri (RxJS pipe)
    this.userService.getUserById(currentUserId).pipe( // [Pas 1: Luăm User-ul proaspăt din DB]
      
      switchMap((user) => {
        // Aici avem user-ul proaspăt (user din DB)
        if (!user || !user.subscriptionId) {
          // Aruncăm o eroare controlată dacă nu are abonament
          return throwError(() => new Error('NO_SUBSCRIPTION'));
        }

        // [Pas 2: Folosind datele user-ului, luăm Subscription și Uses în paralel]
        return forkJoin({
          subscription: this.subscriptionService.getSubscriptionById(user.subscriptionId),
          uses: this.useService.getUsesByUserId(user.id)
        });
      }),
      
      // Prindem erori specifice din lanț
      catchError((err) => {
        // Dacă eroarea e cea aruncată de noi mai sus
        if (err.message === 'NO_SUBSCRIPTION') {
           alert('Contul tău nu are un abonament activ. Te rugăm să contactezi suportul.');
        } else {
           console.error('Eroare API:', err);
           alert('A apărut o eroare la verificarea contului.');
        }
        // Returnăm null pentru a opri fluxul "next" de mai jos
        return of(null); 
      })

    ).subscribe({
      next: (result) => {
        // Dacă result e null (din catchError), ne oprim
        if (!result) {
          this.isLoading = false;
          return;
        }

        const subscriptionName = result.subscription.name;
        const currentUsage = result.uses.length;
        
        // Determinăm limita pe baza numelui abonamentului
        const limit = SUBSCRIPTION_LIMITS[subscriptionName] || 3; 

        console.log(`Flow complet: User -> Subscripție (${subscriptionName}) -> Utilizări (${currentUsage}/${limit})`);

        // [Pas 3: Verificăm Limita]
        if (currentUsage >= limit) {
          alert(`Ai atins limita de ${limit} documente pentru abonamentul ${subscriptionName}. Te rugăm să faci upgrade.`);
          this.router.navigate(['/subscriptions']);
          this.isLoading = false;
        } else {
          // [Pas 4: Totul e OK, facem upload]
          this.performUpload();
        }
      },
      error: (err) => {
        // Aceasta prinde erori fatale de rețea care nu au fost prinse de catchError
        console.error('Critical error:', err);
        this.isLoading = false;
      }
    });
  }

  // Logica efectivă de upload (Rămâne neschimbată)
  private performUpload(): void {
    // Generăm un CNP random pentru test
    var cnp = Math.floor((Math.random() * 10000));
    
    const hardcodedCard: Partial<IdentityCard> = {
      cnp: cnp.toString(),
      series: 'RX',
      firstName: 'Ion',
      lastName: 'Popescu',
      address: 'Strada Exemplului Nr. 1',
      city: 'București',
      county: 'Sector 1',
      country: 'România'
    };

    this.identityCardService.addIdentityCard(hardcodedCard).subscribe({
      next: () => {
        console.log('Document procesat cu succes!');
        this.isLoading = false;
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        console.error('Eroare la procesarea documentului:', error);
        if (this.uploadedFiles[0]) {
          this.uploadedFiles[0].status = 'error';
        }
        this.isLoading = false;
      }
    });
  }

  // --- Metode Utilitare ---
  goBack(): void {
    if (!this.isLoading) {
      this.router.navigate(['/dashboard']);
    }
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }
}