import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface User {
  userId: number;
  fullName: string;
  email: string;
  role: string;
  phoneNumber?: string;
  address?: string;
  isActive: boolean;
  createdAt: string;
}

export interface UserResponse {
  data: User[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
}

export interface UpdateUser {
  fullName: string;
  phoneNumber: string;
  address: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = 'https://localhost:7259/api/Users';

  constructor(private http: HttpClient) { }

  // GET USERS
  getUsers(
    pageNumber: number = 1,
    pageSize: number = 10,
    search?: string,
    role?: string,
    isActive?: boolean
  ): Observable<UserResponse> {

    let params = new HttpParams()
      .set('PageNumber', pageNumber)
      .set('PageSize', pageSize);

    if (search) {
      params = params.set('Search', search);
    }

    if (role) {
      params = params.set('Role', role);
    }

    if (isActive !== undefined) {
      params = params.set('IsActive', isActive);
    }

    return this.http.get<UserResponse>(
      this.apiUrl,
      { params }
    );
  }

  // GET USER BY ID
  getUserById(userId: number): Observable<User> {

    return this.http.get<User>(
      `${this.apiUrl}/${userId}`
    );
  }

  // UPDATE USER
  updateUser(
    userId: number,
    user: UpdateUser
  ): Observable<string> {

    return this.http.put(
      `${this.apiUrl}/${userId}`,
      user,
      {
        responseType: 'text'
      }
    );
  }

  // DEACTIVATE USER
  deactivateUser(userId: number): Observable<string> {
    return this.http.patch(
      `${this.apiUrl}/${userId}/deactivate`,
      {},
      {
        responseType: 'text'
      }
    );
  }
}
