
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


export interface Payment {
  paymentId: number;
  orderId: number;
  paymentMethod: string;
  paymentStatus: string;
  transactionId?: string;
  paymentDate?: string;
  amount: number;
}

export interface CreatePayment {
  orderId: number;
  paymentMethod: string;
  amount: number;
}


@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  private apiUrl =
    'https://localhost:7259/api/Payments';


  constructor(
    private http: HttpClient
  ) { }


  // =========================
  // CREATE PAYMENT
  // =========================

  createPayment(
    payment: CreatePayment
  ): Observable<Payment> {

    return this.http.post<Payment>(
      this.apiUrl,
      payment
    );
  }


  // =========================
  // GET PAYMENT BY ORDER
  // =========================

  getPaymentByOrderId(
    orderId: number
  ): Observable<Payment> {

    return this.http.get<Payment>(
      `${ this.apiUrl } /order/${ orderId } `
    );
  }

}
