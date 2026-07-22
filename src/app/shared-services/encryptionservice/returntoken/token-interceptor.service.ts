import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../../authService/auth.service';

// export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
//   const authService = inject(AuthService);

//   let activeToken: string | null = null;

//   // Request Path / URL herera Token match garne (Conflict huna nadine)
//   if (req.url.includes('/products')) {
//     activeToken = authService.getAdminToken();
//   } 
//   // Future roles ko lagi yassari thapne:
//   // else if (req.url.includes('/vendor')) { activeToken = authService.getVendorToken(); }
//   else {
//     activeToken = authService.getCustomerToken();
//   }

//   // Fallback: Yadi URL bata payena bhane matrai Priority Array check garne
//   if (!activeToken) {
//     const availableTokens = [
//       authService.getAdminToken(),
//       authService.getCustomerToken()
//     ];
//     activeToken = availableTokens.find(token => !!token && token !== 'null' && token !== 'undefined') || null;
//   }

//   let headers: any = { 'ngrok-skip-browser-warning': 'true' };

//   if (activeToken && activeToken !== 'null' && activeToken !== 'undefined') {
//     headers['Authorization'] = `Bearer ${activeToken}`;
//   }

//   return next(req.clone({ setHeaders: headers }));
// };



export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  // Active Role haruko Priority Hierarchy List
  const availableTokens = [

    // authService.getVendorToken(),   // Future Role 1
    // authService.getManagerToken(),  // Future Role 2
    authService.getAdminToken(),
    authService.getCustomerToken(),
  ];

  // System le jo log-in chha tesko pahilo valid token linchha
  const activeToken = availableTokens.find(token => !!token && token !== 'null' && token !== 'undefined');

  let headers: any = { 'ngrok-skip-browser-warning': 'true' };

  if (activeToken) {
    headers['Authorization'] = `Bearer ${activeToken}`;
  }

  return next(req.clone({ setHeaders: headers }));
};