import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

import { AuthService } from './../../authService/auth.service';
import { AdminloginService } from '../../login/adminlogin/adminlogin/adminlogin.service';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {

  const service = inject(AdminloginService);
  const authService = inject(AuthService);

  const token = authService.gettoken();

  let headers: any = {
    'ngrok-skip-browser-warning': 'true'
  };

  // Add token if exists
  if (token && token !== 'null' && token !== 'undefined') {
    headers['Authorization'] = `Bearer ${token}`;
  }
  const authReq = req.clone({
    setHeaders: headers
  });

  return next(authReq);
};
