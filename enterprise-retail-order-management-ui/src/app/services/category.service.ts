import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Category {
  categoryId: number;
  categoryName: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
}

export interface CategoryResponse {
  data: Category[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
}

export interface CreateCategory {
  categoryName: string;
  description: string;
}

export interface UpdateCategory {
  categoryName: string;
  description: string;
}

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private apiUrl =
    'https://localhost:7259/api/Categories';

  constructor(private http: HttpClient) { }

  getCategories(
    pageNumber: number = 1,
    pageSize: number = 10,
    search?: string,
    isActive?: boolean
  ): Observable<CategoryResponse> {

    let params = new HttpParams()
      .set('PageNumber', pageNumber)
      .set('PageSize', pageSize);

    if (search) {
      params = params.set('Search', search);
    }

    if (isActive !== undefined) {
      params = params.set('IsActive', isActive);
    }

    return this.http.get<CategoryResponse>(
      this.apiUrl,
      { params }
    );
  }

  getCategoryById(
    categoryId: number
  ): Observable<Category> {

    return this.http.get<Category>(
      `${this.apiUrl}/${categoryId}`
    );
  }

  createCategory(
    category: CreateCategory
  ): Observable<Category> {

    return this.http.post<Category>(
      this.apiUrl,
      category
    );
  }

  updateCategory(
    categoryId: number,
    category: UpdateCategory
  ): Observable<string> {

    return this.http.put(
      `${this.apiUrl}/${categoryId}`,
      category,
      {
        responseType: 'text'
      }
    );
  }

  deactivateCategory(
    categoryId: number
  ): Observable<string> {

    return this.http.patch(
      `${this.apiUrl}/${categoryId}/deactivate`,
      {},
      {
        responseType: 'text'
      }
    );
  }
}
