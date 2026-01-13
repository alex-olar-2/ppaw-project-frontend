import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IdentityDocumentResult } from '../models/models';
import { environment } from '../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class IdentityDocumentService {
  private apiUrl = `${environment.apiUrl}/IdentityDocument`;

  constructor(private http: HttpClient) { }

  /**
   * Analizează un document dintr-un URL public.
   * Endpoint: POST /IdentityDocument/analyze-url
   */
  analyzeDocumentFromUrl(documentUrl: string): Observable<IdentityDocumentResult> {
    // Backend-ul așteaptă un obiect JSON cu proprietatea "DocumentUrl"
    return this.http.post<IdentityDocumentResult>(`${this.apiUrl}/analyze-url`, { documentUrl });
  }

  /**
   * Analizează un fișier încărcat local (ex: .jpg, .pdf).
   * Endpoint: POST /IdentityDocument/analyze-file
   */
  analyzeDocumentFromFile(file: File): Observable<IdentityDocumentResult> {
    const formData = new FormData();
    // Cheia 'file' trebuie să coincidă cu numele parametrului din controller (IFormFile file)
    formData.append('file', file);

    return this.http.post<IdentityDocumentResult>(`${this.apiUrl}/analyze-file`, formData);
  }

  /**
   * Returnează lista câmpurilor suportate pentru extracție.
   * Endpoint: GET /IdentityDocument/supported-fields
   */
  getSupportedFields(): Observable<{ fields: string[] }> {
    return this.http.get<{ fields: string[] }>(`${this.apiUrl}/supported-fields`);
  }
}