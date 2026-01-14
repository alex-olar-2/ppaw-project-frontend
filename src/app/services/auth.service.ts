import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/models';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser$: Observable<User | null>;

  constructor(private router: Router) {
    // La inițializare, verificăm dacă există date în sessionStorage
    const storedUser = sessionStorage.getItem('CurrentUser');
    this.currentUserSubject = new BehaviorSubject<User | null>(storedUser ? JSON.parse(storedUser) : null);
    this.currentUser$ = this.currentUserSubject.asObservable();
  }

  // Metoda pentru a obține valoarea curentă (fără a te abona)
  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  // Apelată la Login
  login(user: User): void {
    // 1. Salvăm în sessionStorage (persistă până la închiderea tab-ului)
    sessionStorage.setItem('CurrentUser', JSON.stringify(user));
    // 2. Notificăm restul aplicației
    this.currentUserSubject.next(user);
  }

  // Apelată la Logout
  logout(): void {
    // 1. Ștergem din sessionStorage
    sessionStorage.removeItem('CurrentUser');
    // 2. Setăm null în aplicație
    this.currentUserSubject.next(null);
    // 3. Redirecționăm către login
    this.router.navigate(['/login']);
  }

  // Verifică dacă utilizatorul este logat
  isLoggedIn(): boolean {
    return !!this.currentUserValue;
  }
}