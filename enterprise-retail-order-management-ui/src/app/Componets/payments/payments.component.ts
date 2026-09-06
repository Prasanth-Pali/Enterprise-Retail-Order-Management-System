import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import {
  Payment,
  PaymentService,
  CreatePayment
} from '../../services/payment.service';

@Component({
  selector: 'app-payments',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './payments.component.html',
  styleUrl: './payments.component.css'
})
export class PaymentsComponent implements OnInit {

  payments: Payment[] = [];

  search = '';
  selectedStatus = '';

  currentPage = 1;
  pageSize = 5;
  totalCount = 0;

  isLoading = false;

  successMessage = '';
  errorMessage = '';

  showPaymentDetailsModal = false;
  selectedPayment: Payment | null = null;

  orderId: number | null = null;
  amount = 0;

  isAdmin = false;
  isCustomer = false;

  selectedPaymentMethod = '';

  showPaymentSuccessModal = false;
  paymentTransactionId = '';

  constructor(
    private paymentService: PaymentService,
    private router: Router
  ) { }

  ngOnInit(): void {

    const state = history.state;

    this.orderId = state.orderId ?? null;
    this.amount = state.amount ?? 0;

    const token = localStorage.getItem('token');

    if (!token) {
      this.router.navigate(['/login']);
      return;
    }

    try {

      const payload = JSON.parse(
        atob(token.split('.')[1])
      );

      const role =
        payload[
        'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
        ] ||
        payload['role'];

      this.isAdmin = role === 'admin';
      this.isCustomer = role === 'customer';

      console.log('Payment Order ID:', this.orderId);
      console.log('Payment Amount:', this.amount);
      console.log('Payment Role:', role);

    } catch (error) {

      console.error('Invalid token:', error);

      localStorage.removeItem('token');
      this.router.navigate(['/login']);
    }
  }

  makePayment(): void {

    if (!this.orderId) {
      this.errorMessage = 'Order information is missing.';
      return;
    }

    if (!this.selectedPaymentMethod) {
      this.errorMessage = 'Please select a payment method.';
      return;
    }

    const request: CreatePayment = {
      orderId: this.orderId,
      paymentMethod: this.selectedPaymentMethod,
      amount: this.amount
    };

    console.log(
      'PAYMENT REQUEST:',
      JSON.stringify(request, null, 2)
    );

    this.paymentService
      .createPayment(request)
      .subscribe({

        next: (payment) => {

          console.log(
            'PAYMENT SUCCESS:',
            payment
          );

          this.paymentTransactionId =
            payment.transactionId || '';

          this.showPaymentSuccessModal = true;

          this.errorMessage = '';
        },

        error: (error) => {

          console.error(
            'PAYMENT ERROR:',
            error
          );

          this.errorMessage =
            error.error ||
            'Unable to process payment.';
        }

      });
  }

  goToMyOrders(): void {

    this.showPaymentSuccessModal = false;

    this.router.navigate(['/orders']);
  }

  // Load payment history
  loadPayments(): void {

    this.isLoading = true;
    this.errorMessage = '';

    this.paymentService
      .getPayments(
        this.currentPage,
        this.pageSize,
        this.search || undefined,
        this.selectedStatus || undefined
      )
      .subscribe({
        next: (response) => {

          console.log(
            'PAYMENTS RESPONSE:',
            response
          );

          this.payments = response.data;
          this.totalCount = response.totalCount;

          this.isLoading = false;
        },

        error: (error) => {

          console.error(
            'PAYMENTS API ERROR:',
            error
          );

          this.errorMessage =
            error.error ||
            'Unable to load payment history.';

          this.isLoading = false;
        }
      });
  }

  // Search / filter
  filterPayments(): void {

    this.currentPage = 1;

    this.loadPayments();
  }

  // Clear search and filter
  clearFilters(): void {

    this.search = '';
    this.selectedStatus = '';
    this.currentPage = 1;

    this.loadPayments();
  }

  // Pagination
  goToPage(page: number): void {

    if (
      page < 1 ||
      page > this.totalPages
    ) {
      return;
    }

    this.currentPage = page;

    this.loadPayments();
  }

  get totalPages(): number {

    return Math.ceil(
      this.totalCount /
      this.pageSize
    );
  }

  get pages(): number[] {

    return Array.from(
      {
        length: this.totalPages
      },
      (_, index) => index + 1
    );
  }

  // View payment details
  viewPayment(orderId: number): void {

    this.isLoading = true;
    this.errorMessage = '';

    this.paymentService
      .getPaymentByOrderId(orderId)
      .subscribe({
        next: (payment) => {

          console.log(
            'PAYMENT DETAILS:',
            payment
          );

          this.selectedPayment = payment;
          this.showPaymentDetailsModal = true;

          this.isLoading = false;
        },

        error: (error) => {

          console.error(
            'PAYMENT DETAILS ERROR:',
            error
          );

          this.errorMessage =
            error.error ||
            'Unable to load payment details.';

          this.isLoading = false;
        }
      });
  }

  // Close details popup
  closePaymentDetails(): void {

    this.showPaymentDetailsModal = false;
    this.selectedPayment = null;
  }

  // Back to Admin Dashboard
  goBack(): void {

    this.router.navigate([
      '/admin'
    ]);
  }
}
