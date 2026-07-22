import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../authService/auth.service';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  // Request ko target URL check garne
  const isAdminRequest = req.url.toLowerCase().includes('/admin');

  // Request Route anusar Right Token hanne:
  // Admin route ho bhane Admin Token, natra Customer Token
  const token = isAdminRequest 
    ? authService.getAdminToken() 
    : authService.getCustomerToken();

  let headers: any = {
    'ngrok-skip-browser-warning': 'true'
  };

  // Valid token xa bhane Authorization Header ma set garne
  if (token && token !== 'null' && token !== 'undefined') {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const authReq = req.clone({
    setHeaders: headers
  });

  return next(authReq);
};