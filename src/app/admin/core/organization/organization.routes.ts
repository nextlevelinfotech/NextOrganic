import { Routes } from '@angular/router';
import { CompanyDetailsComponent } from './company-details/company-details.component';

export const organizationRoutes: Routes = [
    // note lazy loading
  // {
  //   path: 'company-details',
  //   loadComponent: () =>
  //     import('./company-details/company-details.component').then(
  //       (m) => m.CompanyDetailsComponent
  //     ),
  // },  


  // note egar loading
  {
    path: 'company-details',
    component:CompanyDetailsComponent
  },

    // note egar loading end

  {
    path: 'leavesetup',
    loadComponent: () =>
      import('./leave-setup/leave-setup.component').then(
        (m) => m.LeaveSetupComponent
      ),
  },
];
