import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import {
  OrderService,
  CreateOrder
} from '../../services/order.service';

import {
  Product,
  ProductService
} from '../../services/product.service';
import { Router } from '@angular/router';
import {
  Category,
  CategoryService
} from '../../services/category.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent implements OnInit {

  products: Product[] = [];

  isLoading = false;
  errorMessage = '';
  successMessage = '';

  search = '';
  selectedCategoryId: number | undefined;
  selectedStatus = '';

  currentPage = 1;
  pageSize = 5;
  totalCount = 0;

  isAdmin = false;
  isCustomer = false;

  showAddModal = false;
  addForm!: FormGroup;

  categories: Category[] = [];

  showEditModal = false;
  selectedProduct: Product | null = null;
  editForm!: FormGroup;

  showDeactivateModal = false;
  selectedProductForDeactivate: Product | null = null;

  showProductDetailsModal = false;
  selectedProductForDetails: Product | null = null;
  quantity = 1;

  shippingAddress = '';
  showShippingModal = false;

  showOrderSuccessModal = false;
  placedOrderId: number | null = null;
  placedOrderAmount = 0;


  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private orderService: OrderService,
    private router: Router,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {

    this.loadUserRole();

    this.addForm = this.fb.group({
      productName: [
        '',
        [
          Validators.required,
          Validators.maxLength(100)
        ]
      ],

      description: [
        '',
        Validators.maxLength(250)
      ],

      price: [
        0,
        [
          Validators.required,
          Validators.min(0.01)
        ]
      ],

      stockQuantity: [
        0,
        [
          Validators.required,
          Validators.min(0)
        ]
      ],

      categoryId: [
        '',
        Validators.required
      ]
    });

    this.editForm = this.fb.group({
      productName: [
        '',
        [
          Validators.required,
          Validators.maxLength(100)
        ]
      ],

      description: [
        '',
        Validators.maxLength(250)
      ],

      price: [
        0,
        [
          Validators.required,
          Validators.min(0.01)
        ]
      ],

      stockQuantity: [
        0,
        [
          Validators.required,
          Validators.min(0)
        ]
      ],

      categoryId: [
        '',
        Validators.required
      ]
    });

    this.loadCategories();
    this.loadProducts();
  }

  private loadUserRole(): void {

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

    } catch (error) {

      console.error('Invalid token:', error);

      localStorage.removeItem('token');
      this.router.navigate(['/login']);
    }
  }

  viewProduct(product: Product): void {
    this.selectedProductForDetails = product;
    this.quantity = 1;
    this.showProductDetailsModal = true;
  }

  closeProductDetails(): void {
    this.showProductDetailsModal = false;
    this.selectedProductForDetails = null;
    this.quantity = 1;
  }

  increaseQuantity(): void {
    if (
      this.selectedProductForDetails &&
      this.quantity < this.selectedProductForDetails.stockQuantity
    ) {
      this.quantity++;
    }
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  placeOrder(): void {

    if (!this.selectedProductForDetails) {
      return;
    }

    this.shippingAddress = '';
    this.showShippingModal = true;
  }
  

  submitOrder(): void {

    if (!this.selectedProductForDetails) {
      return;
    }

    if (
      !this.shippingAddress ||
      this.shippingAddress.trim().length < 5
    ) {
      return;
    }

    const request: CreateOrder = {
      items: [
        {
          productId:
            this.selectedProductForDetails.productId,

          quantity: this.quantity
        }
      ],

      shippingAddress:
        this.shippingAddress.trim()
    };


    // 👇 IDHI IKKADA ADD CHEYYALI
    console.log(
      'ORDER REQUEST:',
      JSON.stringify(request, null, 2)
    );


    this.orderService.createOrder(request).subscribe({

      next: (order) => {

        console.log('Order created:', order);

        this.showShippingModal = false;
        this.closeProductDetails();

        this.placedOrderId = order.orderId;
        this.placedOrderAmount = order.totalAmount;

        this.showOrderSuccessModal = true;
      },

      error: (error) => {

        console.error(
          'Order creation failed:',
          error
        );

        this.errorMessage =
          error.error ||
          'Unable to place order.';
      }

    });
  }


  continueToPayment(): void {

    this.showOrderSuccessModal = false;

    this.router.navigate(['/payments'], {
      state: {
        orderId: this.placedOrderId,
        amount: this.placedOrderAmount
      }
    });
  }


  loadProducts(): void {

    this.isLoading = true;
    this.errorMessage = '';

    let isActive: boolean | undefined;

    if (this.selectedStatus === 'active') {
      isActive = true;
    }

    if (this.selectedStatus === 'inactive') {
      isActive = false;
    }

    this.productService.getProducts(
      this.currentPage,
      this.pageSize,
      this.search,
      this.selectedCategoryId,
      isActive
    ).subscribe({

      next: (response) => {

        console.log(
          'PRODUCTS API RESPONSE:',
          response
        );

        this.products = response.data;
        this.totalCount = response.totalCount;

        this.isLoading = false;
      },

      error: (error) => {

        console.error(error);

        this.errorMessage =
          'Unable to load products.';

        this.isLoading = false;
      }

    });
  }

  searchProducts(): void {
    this.currentPage = 1;
    this.loadProducts();
  }

  filterProducts(): void {
    this.currentPage = 1;
    this.loadProducts();
  }

  clearFilters(): void {

    this.search = '';
    this.selectedCategoryId = undefined;
    this.selectedStatus = '';
    this.currentPage = 1;

    this.loadProducts();
  }

  get totalPages(): number {
    return Math.ceil(
      this.totalCount / this.pageSize
    );
  }

  nextPage(): void {

    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadProducts();
    }
  }

  previousPage(): void {

    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadProducts();
    }
  }

  goToPage(page: number): void {

    if (
      page >= 1 &&
      page <= this.totalPages
    ) {
      this.currentPage = page;
      this.loadProducts();
    }
  }

  get pages(): number[] {

    return Array.from(
      { length: this.totalPages },
      (_, i) => i + 1
    );
  }

  openAddModal(): void {
    this.addForm.reset({
      productName: '',
      description: '',
      price: 0,
      stockQuantity: 0,
      categoryId: ''
    });

    this.showAddModal = true;
  }

  closeAddModal(): void {
    this.showAddModal = false;
    this.addForm.reset();
  }

  createProduct(): void {

    if (this.addForm.invalid) {
      this.addForm.markAllAsTouched();
      return;
    }

    const request = {
      productName: this.addForm.value.productName,
      description: this.addForm.value.description,
      price: this.addForm.value.price,
      stockQuantity: this.addForm.value.stockQuantity,
      categoryId: this.addForm.value.categoryId
    };

    this.productService.createProduct(request).subscribe({

      next: () => {

        this.closeAddModal();

        this.successMessage =
          'Product created successfully!';

        this.currentPage = 1;

        this.loadProducts();

        setTimeout(() => {
          this.successMessage = '';
        }, 3000);
      },

      error: (error) => {

        console.error(error);

        this.errorMessage =
          error.error ||
          'Unable to create product.';

        setTimeout(() => {
          this.errorMessage = '';
        }, 4000);
      }

    });
  }

  loadCategories(): void {

    this.categoryService.getCategories(
      1,
      100,
      undefined,
      true
    ).subscribe({

      next: (response) => {

        console.log('CATEGORY RESPONSE:', response);

        this.categories = response.data;

      },

      error: (error) => {

        console.error(
          'CATEGORY API ERROR:',
          error
        );

      }

    });
  }

  openEditModal(product: Product): void {

    this.selectedProduct = product;

    this.editForm.patchValue({
      productName: product.productName,
      description: product.description || '',
      price: product.price,
      stockQuantity: product.stockQuantity,
      categoryId: product.categoryId
    });

    this.showEditModal = true;
  }

  closeEditModal(): void {

    this.showEditModal = false;
    this.selectedProduct = null;

    this.editForm.reset();
  }

  updateProduct(): void {

    if (this.editForm.invalid) {
      this.editForm.markAllAsTouched();
      return;
    }

    if (!this.selectedProduct) {
      return;
    }

    const request = {
      productName: this.editForm.value.productName,
      description: this.editForm.value.description,
      price: this.editForm.value.price,
      stockQuantity: this.editForm.value.stockQuantity,
      categoryId: this.editForm.value.categoryId
    };

    this.productService.updateProduct(
      this.selectedProduct.productId,
      request
    ).subscribe({

      next: () => {

        this.closeEditModal();

        this.successMessage =
          'Product updated successfully!';

        this.loadProducts();

        setTimeout(() => {
          this.successMessage = '';
        }, 3000);
      },

      error: (error) => {

        console.error(error);

        this.errorMessage =
          error.error ||
          'Unable to update product.';

        setTimeout(() => {
          this.errorMessage = '';
        }, 4000);
      }

    });
  }

  openDeactivateModal(product: Product): void {

    this.selectedProductForDeactivate = product;
    this.showDeactivateModal = true;
  }

  closeDeactivateModal(): void {

    this.selectedProductForDeactivate = null;
    this.showDeactivateModal = false;
  }

  confirmDeactivate(): void {

    if (!this.selectedProductForDeactivate) {
      return;
    }

    const productId =
      this.selectedProductForDeactivate.productId;

    this.productService
      .deactivateProduct(productId)
      .subscribe({

        next: () => {

          this.closeDeactivateModal();

          this.successMessage =
            'Product deactivated successfully!';

          this.loadProducts();

          setTimeout(() => {
            this.successMessage = '';
          }, 3000);
        },

        error: (error) => {

          console.error(error);

          this.closeDeactivateModal();

          this.errorMessage =
            error.error ||
            'Unable to deactivate product.';

          setTimeout(() => {
            this.errorMessage = '';
          }, 4000);
        }

      });
  }

  goBack(): void {
    if (this.isAdmin) {
      this.router.navigate(['/admin']);
    } else {
      this.router.navigate(['/customer']);
    }
  }
}
