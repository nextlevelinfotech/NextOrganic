import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../authService/auth.service'; // Tapaiko AuthService ko path milaunu

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  // Request Route/URL anusar Token chhhanne
  const isAdminRequest = req.url.toLowerCase().includes('/admin');
  
  const token = isAdminRequest 
    ? authService.getAdminToken() 
    : authService.getCustomerToken();

  let headers: any = {
    'ngrok-skip-browser-warning': 'true'
  };

  if (token && token !== 'null' && token !== 'undefined') {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const authReq = req.clone({
    setHeaders: headers
  });

  return next(authReq);
};