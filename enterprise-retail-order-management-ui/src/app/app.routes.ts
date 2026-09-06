import { Routes } from '@angular/router';
import { LoginComponent } from './Componets/login/login.component';
import { AdminComponent } from './Componets/admin/admin.component';
import { authGuard } from './guards/auth.guard';
import { UsersComponent } from './Componets/users/users.component';
import { CategoriesComponent } from './Componets/categories/categories.component';
import { ProductsComponent } from './Componets/products/products.component';
import { OrdersComponent } from './Componets/orders/orders.component';
import { PaymentsComponent } from './Componets/payments/payments.component';
import { AccountComponent } from './Componets/account/account.component';
import { CustomerComponent } from './Componets/customer/customer.component';
import { NotFoundComponentComponent } from './Componets/not-found-component/not-found-component.component';
import { HomepageComponent } from './Componets/homepage/homepage.component';


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
