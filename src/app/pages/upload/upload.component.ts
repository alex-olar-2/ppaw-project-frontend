import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
// Asigură-te că importul este corect
import { IdentityDocumentService } from '../../services/identity-document.service';
import { IdentityCardService } from '../../services/identity-card.service'; 
import { IdentityCard } from '../../models/models';

interface UploadedFile {
  name: string;
  size: number;
  status: 'ready' | 'error';
  originalFile: File;
}

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
    private identityDocumentService: IdentityDocumentService, // Serviciul vechi (poate vrei să îl păstrezi)
    private identityCardService: IdentityCardService // [MODIFICARE] Injectăm noul serviciu
  ) {}

  // ... (restul metodelor onDragOver, onDrop, handleFiles rămân neschimbate) ...

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

  // [MODIFICARE] Metoda processFiles actualizată
  processFiles(): void {
    if (this.uploadedFiles.length === 0) return;

    this.isLoading = true;

    var cnp = Math.floor((Math.random() * 10000));
    // Obiectul de test hardcodat
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

    // Apelăm AddIdentityCard din backend prin serviciu
    this.identityCardService.addIdentityCard(hardcodedCard).subscribe({
      next: () => {
        console.log('Obiectul hardcodat a fost adăugat cu succes!');
        this.isLoading = false;
        
        // Navigare către dashboard
        this.router.navigate(['/dashboard']); 
      },
      error: (error) => {
        console.error('Eroare la adăugarea obiectului hardcodat:', error);
        this.uploadedFiles[0].status = 'error';
        this.isLoading = false;
      }
    });
  }

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