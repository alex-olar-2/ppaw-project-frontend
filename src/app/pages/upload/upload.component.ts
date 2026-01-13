import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IdentityDocumentService } from '../../services/identity-document.service';

interface UploadedFile {
  name: string;
  size: number;
  status: 'ready' | 'error'; // Am simplificat statusurile
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
  isLoading = false; // Controlează ecranul de "freeze"

  constructor(
    private router: Router,
    private identityService: IdentityDocumentService
  ) {}

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
        // Resetăm lista (doar un fișier permis)
        this.uploadedFiles = []; 

        const uploadedFile: UploadedFile = {
          name: file.name,
          size: file.size,
          status: 'ready', // E gata instantaneu
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

  processFiles(): void {
    if (this.uploadedFiles.length === 0) return;

    // 1. Activăm freeze-ul
    this.isLoading = true;
    const fileToAnalyze = this.uploadedFiles[0].originalFile;

    // 2. Apelăm serviciul
    this.identityService.analyzeDocumentFromFile(fileToAnalyze).subscribe({
      next: (result) => {
        console.log('Analysis Result:', result);
        this.isLoading = false; // 3. Dezactivăm freeze-ul când avem răspunsul
        
        // Navigare
        this.router.navigate(['/dashboard']); 
      },
      error: (error) => {
        console.error('Analysis Error:', error);
        this.uploadedFiles[0].status = 'error';
        this.isLoading = false; // 3. Dezactivăm freeze-ul și la eroare
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