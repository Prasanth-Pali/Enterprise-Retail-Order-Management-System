import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  Payment,
  PaymentService
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
export class PaymentsComponent {

  // =========================
  // PAYMENT INPUTS
  // =========================

  orderId: number | null = null;

  amount: number | null = null;

  paymentMethod = '';


  // =========================
  // PAYMENT RESPONSE
  // =========================

  payment: Payment | null = null;


  // =========================
  // UI STATE
  // =========================

  isLoading = false;

  successMessage = '';

  errorMessage = '';


  constructor(
    private paymentService: PaymentService
  ) { }


  // =========================
  // MAKE PAYMENT
  // =========================

  makePayment(): void {

    this.successMessage = '';
    this.errorMessage = '';
    this.payment = null;


    // Validation
    if (
      !this.orderId ||
      this.amount === null ||
      this.amount <= 0 ||
      !this.paymentMethod
    ) {

      this.errorMessage =
        'Please enter valid payment details.';

      return;
    }


    this.isLoading = true;


    this.paymentService
      .createPayment({

        orderId: this.orderId,

        paymentMethod: this.paymentMethod,

        amount: this.amount

      })
      .subscribe({

        next: (response) => {

          console.log(
            'PAYMENT RESPONSE:',
            response
          );

          this.payment = response;

          this.successMessage =
            'Payment processed successfully!';

          this.isLoading = false;

        },

        error: (error) => {

          console.error(
            'PAYMENT ERROR:',
            error
          );

          this.errorMessage =
            error.error ||
            'Payment could not be processed.';

          this.isLoading = false;

        }

      });
  }


  // =========================
  // GET PAYMENT
  // =========================

  getPayment(): void {

    this.successMessage = '';
    this.errorMessage = '';
    this.payment = null;


    if (!this.orderId) {

      this.errorMessage =
        'Please enter an Order ID.';

      return;
    }


    this.isLoading = true;


    this.paymentService
      .getPaymentByOrderId(this.orderId)
      .subscribe({

        next: (response) => {

          console.log(
            'PAYMENT DETAILS:',
            response
          );

          this.payment = response;

          this.isLoading = false;

        },

        error: (error) => {

          console.error(
            'GET PAYMENT ERROR:',
            error
          );

          this.errorMessage =
            error.error ||
            'Payment not found.';

          this.isLoading = false;

        }

      });
  }


  // =========================
  // RESET
  // =========================

  resetPayment(): void {

    this.orderId = null;

    this.amount = null;

    this.paymentMethod = '';

    this.payment = null;

    this.successMessage = '';

    this.errorMessage = '';

  }

}
