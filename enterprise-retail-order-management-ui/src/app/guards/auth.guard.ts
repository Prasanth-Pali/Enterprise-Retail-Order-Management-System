import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route) => {

  const router = inject(Router);

  const token = localStorage.getItem('token');

  // Login avvakapothe → 404
  if (!token) {
    return router.createUrlTree(['/404']);
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

    const requiredRole = route.data['role'];

    // Role mismatch
    if (requiredRole && role !== requiredRole) {

      if (role === 'admin') {
        return router.createUrlTree(['/admin']);
      }

      if (role === 'customer') {
        return router.createUrlTree(['/customer']);
      }

      return router.createUrlTree(['/404']);
    }

    return true;

  } catch {

    localStorage.removeItem('token');

    return router.createUrlTree(['/404']);
  }
};
