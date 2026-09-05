import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Product {
  productId: number;
  productName: string;
  description?: string;
  price: number;
  stockQuantity: number;
  categoryId: number;
  categoryName?: string;
  isActive: boolean;
  createdAt: string;
}

export interface ProductResponse {
  data: Product[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
}

export interface CreateProduct {
  productName: string;
  description: string;
  price: number;
  stockQuantity: number;
  categoryId: number;
}

export interface UpdateProduct {
  productName: string;
  description: string;
  price: number;
  stockQuantity: number;
  categoryId: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private apiUrl =
    'https://localhost:7259/api/Products';

  constructor(private http: HttpClient) { }

  getProducts(
    pageNumber: number = 1,
    pageSize: number = 10,
    search?: string,
    categoryId?: number,
    isActive?: boolean
  ): Observable<ProductResponse> {

    let params = new HttpParams()
      .set('PageNumber', pageNumber)
      .set('PageSize', pageSize);

    if (search) {
      params = params.set('Search', search);
    }

    if (categoryId !== undefined) {
      params = params.set('CategoryId', categoryId);
    }

    if (isActive !== undefined) {
      params = params.set('IsActive', isActive);
    }

    return this.http.get<ProductResponse>(
      this.apiUrl,
      { params }
    );
  }

  getProductById(
    productId: number
  ): Observable<Product> {

    return this.http.get<Product>(
      `${this.apiUrl}/${productId}`
    );
  }

  createProduct(
    product: CreateProduct
  ): Observable<Product> {

    return this.http.post<Product>(
      this.apiUrl,
      product
    );
  }

  updateProduct(
    productId: number,
    product: UpdateProduct
  ): Observable<string> {

    return this.http.put(
      `${this.apiUrl}/${productId}`,
      product,
      {
        responseType: 'text'
      }
    );
  }

  deactivateProduct(
    productId: number
  ): Observable<string> {

    return this.http.patch(
      `${this.apiUrl}/${productId}/deactivate`,
      {},
      {
        responseType: 'text'
      }
    );
  }
}
