import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route) => {

  const router = inject(Router);

  const token = localStorage.getItem('token');

  // Token lekapothe login ki
  if (!token) {
    return router.createUrlTree(['/login']);
  }

  try {

    // JWT payload decode
    const payload = JSON.parse(
      atob(token.split('.')[1])
    );

    // JWT nunchi role
    const role =
      payload[
      'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
      ];

    // Route ki required role
    const requiredRole = route.data['role'];

    // Role match kakapothe
    if (requiredRole && role !== requiredRole) {

      if (role === 'admin') {
        return router.createUrlTree(['/admin']);
      }

      return router.createUrlTree(['/customer']);
    }

    return true;

  } catch {

    // Invalid token
    localStorage.removeItem('token');

    return router.createUrlTree(['/login']);
  }
};
