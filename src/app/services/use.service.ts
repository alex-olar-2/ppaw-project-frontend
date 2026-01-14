import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Use } from '../models/models';
import { environment } from '../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class UseService {
  private apiUrl = `${environment.apiUrl}/Use`;

  constructor(private http: HttpClient) { }

  getAllUses(): Observable<Use[]> {
    return this.http.get<Use[]>(`${this.apiUrl}/GetAllUses`);
  }

  getUseById(useId: string): Observable<Use> {
    return this.http.get<Use>(`${this.apiUrl}/GetUseById`, {
      params: new HttpParams().set('useId', useId)
    });
  }

  getUseByUserId(userId: string): Observable<Use> {
    return this.http.get<Use>(`${this.apiUrl}/GetUseByUserId`, {
      params: new HttpParams().set('userId', userId)
    });
  }

  getUsesByUserId(userId: string): Observable<Use[]> {
    return this.http.get<Use[]>(`${this.apiUrl}/GetUsesByUserId`, {
      params: new HttpParams().set('userId', userId)
    });
  }

  getUseByIdentityCardId(identityCardId: string): Observable<Use> {
    return this.http.get<Use>(`${this.apiUrl}/GetUseByIdentityCardId`, {
      params: new HttpParams().set('identityCardId', identityCardId)
    });
  }

  addUse(isSucceeded: boolean, userId?: string, identityCardId?: string): Observable<void> {
    let params = new HttpParams().set('isSucceeded', isSucceeded);
    if (userId) params = params.set('userId', userId);
    if (identityCardId) params = params.set('identityCardId', identityCardId);

    return this.http.post<void>(`${this.apiUrl}/AddUse`, null, { params });
  }

  editUse(useId: string, isSucceeded: boolean, userId?: string, identityCardId?: string): Observable<void> {
    let params = new HttpParams()
      .set('useId', useId)
      .set('isSucceeded', isSucceeded);
    if (userId) params = params.set('userId', userId);
    if (identityCardId) params = params.set('identityCardId', identityCardId);

    return this.http.put<void>(`${this.apiUrl}/EditUse`, null, { params });
  }

  deleteUseById(useId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/DeleteUseById`, {
      params: new HttpParams().set('useId', useId)
    });
  }

  deleteUseByUserId(userId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/DeleteUseByUserId`, {
      params: new HttpParams().set('userId', userId)
    });
  }

  deleteUseByIdentityCardId(identityCardId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/DeleteUseByIdentityCardId`, {
      params: new HttpParams().set('identityCardId', identityCardId)
    });
  }

  deleteAllUses(): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/DeleteAllUses`);
  }
}