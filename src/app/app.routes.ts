import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ErrorPageComponent } from './pages/error-page/error-page.component';
import { LayoutComponent } from './admin/core/shared/components/layouts/layout/layout.component';
import { UserLayoutComponent } from './user-admin/core/shared/components/user-layout/user-layout.component';
import { adminAuthGuard } from './shared-services/Authguard/auth.guard';


export const routes: Routes = [
  {
    path: '',
    children: [
      { path: '', component: HomeComponent },
      { path: 'home', component: HomeComponent },

      {
        path: 'login',
        loadComponent: () =>
          import('./user-admin/core/auth/login/login.component').then(
            (m) => m.LoginComponent,
          ),
      },

      {
        path: 'admin-login',
        loadComponent: () =>
          import('./admin/core/Auth/login/adminlogin/adminlogin/adminlogin.component').then(
            (m) => m.AdminloginComponent,
          ),
      },


      {
        path: 'register',
        loadComponent: () =>
          import('./user-admin/core/auth/register/register.component').then(
            (m) => m.RegisterComponent,
          ),
      },

      {
        path: 'about',
        loadComponent: () =>
          import('./pages/about/about.component').then((m) => m.AboutComponent),
      },

      {
        path: 'shop',
        loadChildren: () =>
          import('./pages/shop/shop.routes').then((m) => m.shopRoutes),
      },

      {
        path: 'blog',
        loadComponent: () =>
          import('./pages/blogs/blogs.component').then((m) => m.BlogsComponent),
      },

      // {
      //   path: 'blog-single/:id',
      //   loadComponent: () =>
      //     import('./pages/blog-single/blog-single.component').then(
      //       (m) => m.BlogSingleComponent
      //     ),
      // },

      {
        path: 'blog-single',
        loadComponent: () =>
          import('./pages/blog-single/blog-single.component').then(
            (m) => m.BlogSingleComponent,
          ),
      },

      {
        path: 'contact',
        loadComponent: () =>
          import('./pages/contact/contact.component').then(
            (m) => m.ContactComponent,
          ),
      },

      {
        path: '',
        component: LayoutComponent,
        children: [
          // {
          //   path: 'profile',
          //   loadComponent: () =>
          //     import('./admin/core/company-profile/company-profile.component').then(
          //       (m) => m.CompanyProfileComponent,

          //     ),
          //   canActivate: [authGuard],
          // },
          {
            path: 'products',
            loadComponent: () =>
              import('./admin/core/products/products.component').then(
                (m) => m.ProductsComponent,

              ),
            canActivate: [adminAuthGuard],
          },
          {
            path: 'admin-orders',
            loadComponent: () =>
              import('./admin/core/orders/orders.component').then(
                (m) => m.OrdersComponent,

              ),
            canActivate: [adminAuthGuard],
          },
          {
            path: 'category',
            loadComponent: () =>
              import('./admin/core/category/category.component').then(
                (m) => m.CategoryComponent,

              ),
            canActivate: [adminAuthGuard],
          },
        ],
      },

      {
        path: '',
        component: UserLayoutComponent,
        children: [
          {
            path: 'account',
            loadComponent: () =>
              import('./user-admin/core/pages/account/accout.component').then(
                (m) => m.AccoutComponent,
              ),
            //  canActivate: [authGuard],
          },
          {
            path: 'orders',
            loadComponent: () =>
              import('./user-admin/core/pages/orders/orders.component').then(
                (m) => m.OrdersComponent,
              ),
            // canActivate: [authGuard],
          },
          {
            path: 'myProfile',
            loadComponent: () =>
              import('./user-admin/core/pages/profile/profile.component').then(
                (m) => m.ProfileComponent,
              ),
            //  canActivate: [authGuard],
          },

        ],
      },

      { path: 'error', component: ErrorPageComponent }, // Define error page route
      { path: '**', redirectTo: 'error' }, // Wildcard route for 404 pages
    ],
  },
];
