import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }


  goToUsers(): void {
    this.router.navigate(['/users']);
  }

  goToCategories(): void {
    this.router.navigate(['/categories']);
  }

  goToProducts(): void {
    this.router.navigate(['/products']);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
