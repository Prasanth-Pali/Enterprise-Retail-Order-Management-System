
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import {
  Order,
  OrderService
} from '../../services/order.service';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css'
})
export class OrdersComponent implements OnInit {

  // =========================
  // ORDERS
  // =========================

  orders: Order[] = [];

  isLoading = false;

  errorMessage = '';

  successMessage = '';


  // =========================
  // FILTER
  // =========================

  selectedStatus = '';


  // =========================
  // PAGINATION
  // =========================

  currentPage = 1;

  pageSize = 10;

  totalCount = 0;


  // =========================
  // ORDER DETAILS POPUP
  // =========================

  showOrderDetailsModal = false;

  selectedOrder: Order | null = null;


  // =========================
  // STATUS UPDATE
  // =========================

  selectedNewStatus = '';

  isUpdatingStatus = false;


  constructor(
    private orderService: OrderService,
    private router: Router
  ) { }


  // =========================
  // INITIAL LOAD
  // =========================

  ngOnInit(): void {
    this.loadOrders();
  }


  // =========================
  // GET ORDERS
  // =========================

  loadOrders(): void {

    this.isLoading = true;

    this.errorMessage = '';

    this.orderService.getOrders(
      this.currentPage,
      this.pageSize,
      this.selectedStatus || undefined
    ).subscribe({

      next: (response) => {

        console.log(
          'ORDERS RESPONSE:',
          response
        );

        this.orders = response.data;

        this.totalCount =
          response.totalCount;

        this.isLoading = false;
      },

      error: (error) => {

        console.error(
          'ORDERS API ERROR:',
          error
        );

        this.errorMessage =
          error.error ||
          'Unable to load orders.';

        this.isLoading = false;
      }

    });
  }


  // =========================
  // FILTER ORDERS
  // =========================

  filterOrders(): void {

    this.currentPage = 1;

    this.loadOrders();
  }


  // =========================
  // CLEAR FILTER
  // =========================

  clearFilters(): void {

    this.selectedStatus = '';

    this.currentPage = 1;

    this.loadOrders();
  }


  // =========================
  // PAGINATION
  // =========================

  goToPage(page: number): void {

    if (
      page < 1 ||
      page > this.totalPages
    ) {
      return;
    }

    this.currentPage = page;

    this.loadOrders();
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


  // =========================
  // VIEW ORDER
  // =========================

  viewOrder(orderId: number): void {

    this.isLoading = true;

    this.errorMessage = '';

    this.orderService
      .getOrderById(orderId)
      .subscribe({

        next: (order) => {

          console.log(
            'ORDER DETAILS:',
            order
          );

          this.selectedOrder = order;

          this.selectedNewStatus = '';

          this.showOrderDetailsModal = true;

          this.isLoading = false;
        },

        error: (error) => {

          console.error(
            'ORDER DETAILS ERROR:',
            error
          );

          this.errorMessage =
            error.error ||
            'Unable to load order details.';

          this.isLoading = false;
        }

      });
  }


  // =========================
  // GET ALLOWED NEXT STATUS
  // =========================

  getAllowedStatuses(): string[] {

    if (!this.selectedOrder) {
      return [];
    }

    switch (
      this.selectedOrder.status.toLowerCase()
    ) {

      case 'pending':
        return [
          'Confirmed',
          'Cancelled'
        ];

      case 'confirmed':
        return [
          'Shipped',
          'Cancelled'
        ];

      case 'shipped':
        return [
          'Delivered'
        ];

      default:
        return [];
    }
  }


  // =========================
  // UPDATE ORDER STATUS
  // =========================

  updateStatus(): void {

    if (
      !this.selectedOrder ||
      !this.selectedNewStatus
    ) {
      return;
    }

    const orderId =
      this.selectedOrder.orderId;

    this.isUpdatingStatus = true;

    this.errorMessage = '';

    this.successMessage = '';

    this.orderService
      .updateOrderStatus(
        orderId,
        {
          status: this.selectedNewStatus
        }
      )
      .subscribe({

        next: () => {

          // Update popup immediately
          if (this.selectedOrder) {

            this.selectedOrder = {
              ...this.selectedOrder,
              status: this.selectedNewStatus
            };

          }

          this.successMessage =
            'Order status updated successfully!';

          this.selectedNewStatus = '';

          this.isUpdatingStatus = false;

          // Refresh table
          this.loadOrders();

          // Remove success message
          setTimeout(() => {

            this.successMessage = '';

          }, 3000);
        },

        error: (error) => {

          console.error(
            'UPDATE STATUS ERROR:',
            error
          );

          this.errorMessage =
            error.error ||
            'Unable to update order status.';

          this.isUpdatingStatus = false;
        }

      });
  }


  // =========================
  // CLOSE POPUP
  // =========================

  closeOrderDetails(): void {

    this.showOrderDetailsModal = false;

    this.selectedOrder = null;

    this.selectedNewStatus = '';

    this.errorMessage = '';
  }


  // =========================
  // BACK TO ADMIN
  // =========================

  goBack(): void {

    this.router.navigate([
      '/admin'
    ]);
  }

}

