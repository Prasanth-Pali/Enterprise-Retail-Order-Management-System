import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { LoginResponse } from '../models/login-response';
import { LoginRequest } from '../models/login-request';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = `${environment.apiUrl}/Auth`;

  constructor(
    private http: HttpClient
  ) { }


  // Login
  login(
    request: LoginRequest
  ): Observable<LoginResponse> {

    return this.http.post<LoginResponse>(
      `${ this.apiUrl }/login`,
request
    );
  }

// Register
register(
  request: any
): Observable<string> {

  return this.http.post(
    `${ this.apiUrl }/register`,
request,
{
  responseType: 'text'
}
  );
}



// Logout
logout(): void {

  localStorage.removeItem('token');

}
}
