import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { AdminComponent } from './components/admin/admin.component';
import { authGuard } from './guards/auth.guard';
import { UsersComponent } from './components/users/users.component';
import { CategoriesComponent } from './components/categories/categories.component';
import { ProductsComponent } from './components/products/products.component';
import { OrdersComponent } from './components/orders/orders.component';
import { PaymentsComponent } from './components/payments/payments.component';
import { AccountComponent } from './components/account/account.component';
import { CustomerComponent } from './components/customer/customer.component';
import { NotFoundComponentComponent } from './components/not-found-component/not-found-component.component';
import { HomepageComponent } from './components/homepage/homepage.component';


export const routes: Routes = [

  {
    path: '',
    component: HomepageComponent
  },

  {
    path: 'login',
    component: LoginComponent
  },

  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [authGuard],
    data: {
      role: 'admin'
    }
  },

  {
    path: 'customer',
    component: CustomerComponent,
    canActivate: [authGuard],
    data: {
      role: 'customer'
    }
  },

  {
    path: 'users',
    component: UsersComponent,
    canActivate: [authGuard],
    data: {
      role: 'admin'
    }
  },

  {
    path: 'profile',
    component: AccountComponent,
    canActivate: [authGuard]
  },

  {
    path: 'categories',
    component: CategoriesComponent,
    canActivate: [authGuard]
  },

  {
    path: 'products',
    component: ProductsComponent,
    canActivate: [authGuard]
  },

  {
    path: 'orders',
    component: OrdersComponent,
    canActivate: [authGuard]
  },

  {
    path: 'payments',
    component: PaymentsComponent,
    canActivate: [authGuard]
  },

  {
    path: '404',
    component: NotFoundComponentComponent
  },

  {
    path: '**',
    component: NotFoundComponentComponent
  }
];
