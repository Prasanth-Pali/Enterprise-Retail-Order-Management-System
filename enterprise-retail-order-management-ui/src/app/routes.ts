import { Routes } from '@angular/router';

import { AccountComponent } from './Componets/account/account.component';
import { AdminComponent } from './Componets/admin/admin.component';
import { CategoriesComponent } from './Componets/categories/categories.component';
import { CustomerComponent } from './Componets/customer/customer.component';
import { LoginComponent } from './Componets/login/login.component';
import { OrdersComponent } from './Componets/orders/orders.component';
import { PaymentsComponent } from './Componets/payments/payments.component';
import { ProductsComponent } from './Componets/products/products.component';
import { UsersComponent } from './Componets/users/users.component';
import { NotFoundComponentComponent } from './Componets/not-found-component/not-found-component.component';
import { HomepageComponent } from './Componets/homepage/homepage.component';

import { authGuard } from './guards/auth.guard';

export const routes: Routes = [

  {
    path: '',
    component: HomepageComponent
  },

  // Public Homepage
  {
    path: 'homepage',
    component: HomepageComponent
  },

  // Public Login
  {
    path: 'login',
    component: LoginComponent
  },

  // Admin
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [authGuard],
    data: {
      role: 'admin'
    }
  },

  // Customer
  {
    path: 'customer',
    component: CustomerComponent,
    canActivate: [authGuard],
    data: {
      role: 'customer'
    }
  },

  // Admin - Users
  {
    path: 'users',
    component: UsersComponent,
    canActivate: [authGuard],
    data: {
      role: 'admin'
    }
  },

  // Products
  {
    path: 'products',
    component: ProductsComponent,
    canActivate: [authGuard]
  },

  // Orders
  {
    path: 'orders',
    component: OrdersComponent,
    canActivate: [authGuard]
  },

  // Payments
  {
    path: 'payments',
    component: PaymentsComponent,
    canActivate: [authGuard]
  },

  // Profile
  {
    path: 'profile',
    component: AccountComponent,
    canActivate: [authGuard]
  },

  // 404
  {
    path: '404',
    component: NotFoundComponentComponent
  },

  // Unknown routes
  {
    path: '**',
    component: NotFoundComponentComponent
  }
];
