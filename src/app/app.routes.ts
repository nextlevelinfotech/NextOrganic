import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ErrorPageComponent } from './pages/error-page/error-page.component';
import { LayoutComponent } from './admin/core/shared/components/layouts/layout/layout.component';
import { UserLayoutComponent } from './user-admin/core/shared/components/user-layout/user-layout.component';

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
          {
            path: 'dashboard',
            loadComponent: () =>
              import('./admin/core/dashboard/dashboard.component').then(
                (m) => m.DashboardComponent,
              ),
            // canActivate: [authGuard],
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
            // canActivate: [authGuard],
          },
           {
            path: 'profile',
            loadComponent: () =>
              import('./user-admin/core/pages/profile/profile.component').then(
                (m) => m.ProfileComponent,
              ),
            // canActivate: [authGuard],
          },
        ],
      },

      { path: 'error', component: ErrorPageComponent }, // Define error page route
      { path: '**', redirectTo: 'error' }, // Wildcard route for 404 pages
    ],
  },
];
