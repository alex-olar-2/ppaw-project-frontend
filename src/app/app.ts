import { Component, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from './services/auth.service'; //

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.css' // Asigură-te că extensia este corectă (poate fi .css sau .scss în funcție de proiect)
})
export class App {
  protected readonly title = signal('ppaw-project-frontend');

  // Injectăm AuthService
  constructor(private authService: AuthService) {}

  // Metoda pentru logout
  logout(): void {
    this.authService.logout();
  }
}