import { Routes } from '@angular/router';
import { LoginComponent } from './Componets/login/login.component';
import { AdminComponent } from './Componets/admin/admin.component';
import { authGuard } from './guards/auth.guard';
import { UsersComponent } from './Componets/users/users.component';
import { CategoriesComponent } from './Componets/categories/categories.component';


export const routes: Routes = [
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
    },
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
    path: 'categories',
    component: CategoriesComponent,
    canActivate: [authGuard],
    data: { role: 'admin' }
  },

  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  //{
  //  path: 'customer',
  //  component: CustomerComponent,
  //  canActivate: [authGuard],
  //  data: {
  //    role: 'customer'
  //  }
  //}
];
