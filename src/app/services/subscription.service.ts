import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Subscription } from '../models/models';
import { environment } from '../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {
  private apiUrl = `${environment.apiUrl}/Subscription`;

  constructor(private http: HttpClient) { }

  getAllSubscriptions(): Observable<Subscription[]> {
    return this.http.get<Subscription[]>(`${this.apiUrl}/GetAllSubscriptions`);
  }

  getDefaultSubscription(): Observable<Subscription> {
    return this.http.get<Subscription>(`${this.apiUrl}/GetDefaultSubscription`);
  }

  getSubscriptionById(id: string): Observable<Subscription> {
    return this.http.get<Subscription>(`${this.apiUrl}/GetSubscriptionById`, {
      params: new HttpParams().set('id', id)
    });
  }

  addSubscription(subscriptionName: string, price: number, isDefault: boolean): Observable<void> {
    const params = new HttpParams()
      .set('subscriptionName', subscriptionName)
      .set('price', price)
      .set('isDefault', isDefault);

    return this.http.post<void>(`${this.apiUrl}/AddSubscription`, null, { params });
  }

  editSubscription(subscriptionId: string, subscriptionName: string, price: number, isDefault: boolean): Observable<void> {
    const params = new HttpParams()
      .set('subscriptionId', subscriptionId)
      .set('subscriptionName', subscriptionName)
      .set('price', price)
      .set('isDefault', isDefault);

    return this.http.put<void>(`${this.apiUrl}/EditSubscription`, null, { params });
  }

  deleteSubscriptionById(subscriptionId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/DeleteSubscriptionById`, {
      params: new HttpParams().set('subscriptionId', subscriptionId)
    });
  }

  deleteAllSubscriptions(): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/DeleteAllSubscription`);
  }
}