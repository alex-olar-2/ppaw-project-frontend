import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/models';
import { environment } from '../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/User`;

  constructor(private http: HttpClient) { }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/GetAllUsers`);
  }

  getUserById(userId: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/GetUserById`, {
      params: new HttpParams().set('userId', userId)
    });
  }

  addUser(data: Partial<User>): Observable<void> {
    let params = new HttpParams();
    if (data.email) params = params.set('email', data.email);
    if (data.password) params = params.set('password', data.password);
    if (data.cui) params = params.set('cui', data.cui);
    if (data.subscriptionId) params = params.set('subscriptionId', data.subscriptionId);
    if (data.roleId) params = params.set('roleId', data.roleId);

    return this.http.post<void>(`${this.apiUrl}/AddUser`, null, { params });
  }

  editUser(userId: string, data: Partial<User>): Observable<void> {
    let params = new HttpParams().set('userId', userId);
    if (data.email) params = params.set('email', data.email);
    if (data.password) params = params.set('password', data.password);
    if (data.cui) params = params.set('cui', data.cui);
    if (data.subscriptionId) params = params.set('subscriptionId', data.subscriptionId);
    if (data.roleId) params = params.set('roleId', data.roleId);

    return this.http.put<void>(`${this.apiUrl}/EditUser`, null, { params });
  }

  deleteUserById(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/DeleteUserById`, {
      params: new HttpParams().set('id', id)
    });
  }

  deleteAllUsers(): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/DeleteAllUser`);
  }
}