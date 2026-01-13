import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface UploadedFile {
  name: string;
  size: number;
  progress: number;
  status: 'uploading' | 'success' | 'error';
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

  constructor(private router: Router) {}

  onDragOver(event: DragEvent): void {
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
    Array.from(files).forEach(file => {
      if (file.type === 'application/pdf') {
        const uploadedFile: UploadedFile = {
          name: file.name,
          size: file.size,
          progress: 0,
          status: 'uploading'
        };
        this.uploadedFiles.push(uploadedFile);
        this.simulateUpload(uploadedFile);
      }
    });
  }

  simulateUpload(file: UploadedFile): void {
    const interval = setInterval(() => {
      file.progress += 10;
      if (file.progress >= 100) {
        file.status = 'success';
        clearInterval(interval);
      }
    }, 300);
  }

  removeFile(file: UploadedFile): void {
    const index = this.uploadedFiles.indexOf(file);
    if (index > -1) {
      this.uploadedFiles.splice(index, 1);
    }
  }

  processFiles(): void {
    console.log('Processing files:', this.uploadedFiles);
    // Navigate back to dashboard after processing
    setTimeout(() => {
      this.router.navigate(['/dashboard']);
    }, 1000);
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }

  hasUploadingFiles(): boolean {
    return this.uploadedFiles.some(f => f.status === 'uploading');
  }
}