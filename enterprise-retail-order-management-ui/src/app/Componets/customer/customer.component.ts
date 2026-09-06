
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-customer',
  standalone: true,
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {

  customerName = 'Customer';

  constructor(
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCustomerName();
  }

  private loadCustomerName(): void {
    const token = localStorage.getItem('token');

    if (!token) {
      this.router.navigate(['/login']);
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));

      const name =
        payload[
          'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'
        ] ||
        payload['name'];

      if (name) {
        this.customerName = name;
      }

    } catch (error) {
      console.error('Invalid token:', error);

      localStorage.removeItem('token');
      this.router.navigate(['/login']);
    }
  }

  browseProducts(): void {
    this.router.navigate(['/products']);
  }

  goToOrders(): void {
    this.router.navigate(['/orders']);
  }

  goToProfile(): void {
    this.router.navigate(['/profile']);
  }

  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
