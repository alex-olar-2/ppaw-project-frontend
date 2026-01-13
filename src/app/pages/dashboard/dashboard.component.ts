import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface Document {
  id: number;
  name: string;
  uploadDate: Date;
  status: string;
  size: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  documents: Document[] = [
    { id: 1, name: 'Contract_2024.pdf', uploadDate: new Date('2024-01-15'), status: 'Processed', size: '2.4 MB' },
    { id: 2, name: 'Invoice_Jan.pdf', uploadDate: new Date('2024-01-10'), status: 'Pending', size: '1.2 MB' },
    { id: 3, name: 'Report_Q4.pdf', uploadDate: new Date('2024-01-05'), status: 'Processed', size: '3.8 MB' }
  ];

  stats = {
    totalDocuments: 156,
    processedToday: 12,
    pendingReview: 8,
    totalSize: '45.2 GB'
  };

  constructor(private router: Router) {}

  navigateToUpload(): void {
    this.router.navigate(['/upload']);
  }

  viewDocument(doc: Document): void {
    console.log('View document:', doc);
  }

  deleteDocument(doc: Document): void {
    console.log('Delete document:', doc);
  }

  logout(): void {
    this.router.navigate(['/login']);
  }
}