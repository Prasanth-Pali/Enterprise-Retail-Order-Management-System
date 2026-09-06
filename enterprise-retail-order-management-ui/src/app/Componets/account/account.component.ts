import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { User, UserService } from '../../services/user.service';



@Component({
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {

  user: User | null = null;
  errorMessage = '';
  formattedCreatedAt = '';

  constructor(
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadAccount();
  }

  loadAccount(): void {
    const token = localStorage.getItem('token');

    if (!token) {
      this.router.navigate(['/login']);
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));

      const userId =
        payload[
        'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'
        ] ||
        payload['nameid'];

      if (!userId) {
        this.errorMessage = 'User information not found.';
        return;
      }

      this.userService.getUserById(Number(userId)).subscribe({
        next: (response: User) => {
          this.user = response;

          this.formattedCreatedAt = new Date(
            response.createdAt
          ).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
          });
        },

        error: (error) => {
          console.error('Error loading account:', error);
          this.errorMessage = 'Unable to load account details.';
        }
      });

    } catch (error) {
      console.error('Invalid token:', error);
      localStorage.removeItem('token');
      this.router.navigate(['/login']);
    }
  }

  goBack(): void {
    const token = localStorage.getItem('token');

    if (!token) {
      this.router.navigate(['/login']);
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));

      const role =
        payload[
        'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
        ] || payload['role'];

      if (role === 'admin') {
        this.router.navigate(['/admin']);
      } else if (role === 'customer') {
        this.router.navigate(['/customer']);
      } else {
        this.router.navigate(['/login']);
      }

    } catch {
      localStorage.removeItem('token');
      this.router.navigate(['/login']);
    }
  }

  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
