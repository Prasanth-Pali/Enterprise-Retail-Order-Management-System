
import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpParams
} from '@angular/common/http';
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

export interface PaymentResponse {
  data: Payment[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
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

  // Customer - Create payment
  createPayment(
    payment: CreatePayment
  ): Observable<Payment> {

    return this.http.post<Payment>(
      this.apiUrl,
      payment
    );
  }

  // Admin - Get payment history
  getPayments(
    pageNumber: number = 1,
    pageSize: number = 10,
    search?: string,
    paymentStatus?: string
  ): Observable<PaymentResponse> {

    let params = new HttpParams()
      .set('PageNumber', pageNumber)
      .set('PageSize', pageSize);

    if (search) {
      params = params.set(
        'Search',
        search
      );
    }

    if (paymentStatus) {
      params = params.set(
        'PaymentStatus',
        paymentStatus
      );
    }

    return this.http.get<PaymentResponse>(
      this.apiUrl,
      { params }
    );
  }

// Admin / Customer - Get payment details
getPaymentByOrderId(
  orderId: number
): Observable<Payment> {

  return this.http.get<Payment>(
    `${ this.apiUrl}/order/${ orderId }`
  );
}

}
