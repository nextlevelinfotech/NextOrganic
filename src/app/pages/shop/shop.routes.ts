import { Routes } from '@angular/router';

export const shopRoutes: Routes = [
  {
    path: 'categories',
    loadComponent: () =>
      import('./shop-categories/shop-categories.component').then(
        (m) => m.ShopCategoriesComponent,
      ),
  },

  {
    path: 'shop-single',
    loadComponent: () =>
      import('./shop-single/shop-single.component').then(
        (m) => m.ShopSingleComponent,
      ),
  },

  {
    path: 'shop-cart',
    loadComponent: () =>
      import('./shop-cart/shop-cart.component').then(
        (m) => m.ShopCartComponent,
      ),
  },
  {
    path: 'checkout',
    loadComponent: () =>
      import('./check-out/check-out.component').then(
        (m) => m.CheckOutComponent,
      ),
  },

  {
    path: 'wishlist',
    loadComponent: () =>
      import('./wishlist/wishlist.component').then((m) => m.WishlistComponent),
  },
];
