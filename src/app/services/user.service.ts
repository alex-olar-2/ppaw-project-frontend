import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
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

  // ADĂUGAT: Metoda de login
  login(email: string, password: string): Observable<User> {
    const params = new HttpParams()
      .set('email', email)
      .set('password', password);
    
    // Backend-ul returnează: { token: string, userId: string, email: string }
    // Folosim <any> temporar pentru răspunsul de la API pentru a-l mapa manual
    return this.http.get<any>(`${this.apiUrl}/Login`, { params }).pipe(
      map(response => {
        // Construim obiectul User pe baza răspunsului
        const user: User = {
          id: response.userId,     // Backend: UserId -> Frontend: id
          email: response.email,   // Backend: Email  -> Frontend: email
          token: response.token,   // Backend: Token  -> Frontend: token
          isVisible: true          // Default pentru BaseEntity
          // Restul câmpurilor (roleId, etc.) rămân undefined momentan
        } as User;

        return user;
      })
    );
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