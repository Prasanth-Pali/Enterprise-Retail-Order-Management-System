import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface OrderItem {
  orderItemId: number;
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  subTotal: number;
}

export interface Order {
  orderId: number;
  userId: number;
  customerName: string;
  orderDate: string;
  totalAmount: number;
  status: string;
  shippingAddress?: string;
  items: OrderItem[];
}

export interface OrderResponse {
  data: Order[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
}

export interface UpdateOrderStatus {
  status: string;
}

export interface CreateOrderItem {
  productId: number;
  quantity: number;
}

export interface CreateOrder {
  items: CreateOrderItem[];
  shippingAddress: string;
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private apiUrl =
    'https://localhost:7259/api/Orders';

  constructor(
    private http: HttpClient
  ) { }

  getOrders(
    pageNumber: number = 1,
    pageSize: number = 10,
    status?: string
  ): Observable<OrderResponse> {

    let params = new HttpParams()
      .set('PageNumber', pageNumber)
      .set('PageSize', pageSize);

    if (status) {
      params = params.set('Status', status);
    }

    return this.http.get<OrderResponse>(
      this.apiUrl,
      { params }
    );
  }

  getOrderById(
    orderId: number
  ): Observable<Order> {

    return this.http.get<Order>(
      `${this.apiUrl}/${orderId}`
    );
  }

  createOrder(
    request: CreateOrder
  ): Observable<Order> {

    return this.http.post<Order>(
      this.apiUrl,
      request
    );
  }

  updateOrderStatus(
    orderId: number,
    request: UpdateOrderStatus
  ): Observable<string> {

    return this.http.patch(
      `${this.apiUrl}/${orderId}/status`,
      request,
      {
        responseType: 'text'
      }
    );
  }
}
