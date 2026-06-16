import { Routes } from '@angular/router';

export const tableSpaceRoutes: Routes = [
    // note lazy loading
  {
    path: 'qr',
    loadComponent: () =>
      import('./qr-codes/qr-codes.component').then(
        (m) => m.QRCodesComponent
      ),
  },

    {
    path: 'qr-menu',
    loadComponent: () =>
      import('./qr-menu/qr-menu.component').then(
        (m) => m.QrMenuComponent
      ),
  },




];
