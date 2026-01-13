import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IdentityCard } from '../models/models';
import { environment } from '../../environment/environment'; // Ensure you have this environment file

@Injectable({
  providedIn: 'root'
})
export class IdentityCardService {
  private apiUrl = `${environment.apiUrl}/IdentityCard`;

  constructor(private http: HttpClient) { }

  getAllIdentityCards(): Observable<IdentityCard[]> {
    return this.http.get<IdentityCard[]>(`${this.apiUrl}/GetAllIdentityCards`);
  }

  getIdentityCardById(identityCardId: string): Observable<IdentityCard> {
    return this.http.get<IdentityCard>(`${this.apiUrl}/GetIdentityCardById`, {
      params: new HttpParams().set('identitiyCardId', identityCardId) // Note: Backend param typo 'identitiyCardId'
    });
  }

  getIdentityCardByCnp(cnp: string): Observable<IdentityCard> {
    return this.http.get<IdentityCard>(`${this.apiUrl}/GetIdentityCardByCnp`, {
      params: new HttpParams().set('cnp', cnp)
    });
  }

  addIdentityCard(data: Partial<IdentityCard>): Observable<void> {
    let params = new HttpParams();
    if (data.cnp) params = params.set('cnp', data.cnp);
    if (data.series) params = params.set('series', data.series);
    if (data.firstName) params = params.set('firstName', data.firstName);
    if (data.lastName) params = params.set('lastName', data.lastName);
    if (data.address) params = params.set('address', data.address);
    if (data.city) params = params.set('city', data.city);
    if (data.county) params = params.set('county', data.county);
    if (data.country) params = params.set('country', data.country);
    // isVisible defaults to true in backend if omitted

    return this.http.post<void>(`${this.apiUrl}/AddIdentityCard`, null, { params });
  }

  editIdentityCard(id: string, data: Partial<IdentityCard>): Observable<void> {
    let params = new HttpParams().set('identityCardId', id);
    if (data.cnp) params = params.set('cnp', data.cnp);
    if (data.series) params = params.set('series', data.series);
    if (data.firstName) params = params.set('firstName', data.firstName);
    if (data.lastName) params = params.set('lastName', data.lastName);
    if (data.address) params = params.set('address', data.address);
    if (data.city) params = params.set('city', data.city);
    if (data.county) params = params.set('county', data.county);
    if (data.country) params = params.set('country', data.country);

    return this.http.put<void>(`${this.apiUrl}/EditIdentityCard`, null, { params });
  }

  deleteIdentityCardById(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/DeleteIdentityCardById`, {
      params: new HttpParams().set('id', id)
    });
  }

  deleteIdentityCardByCnp(cnp: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/DeleteIdentityCardByCnp`, {
      params: new HttpParams().set('cnp', cnp)
    });
  }

  deleteAllIdentityCards(): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/DeleteAllIdentityCard`);
  }
}