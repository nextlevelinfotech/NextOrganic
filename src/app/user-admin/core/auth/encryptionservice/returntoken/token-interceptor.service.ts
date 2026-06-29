import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { loginService } from '../../login/login.service';
import { AuthService } from '../../authService/auth.service';



export const tokenInterceptor: HttpInterceptorFn = (req, next) => {

  const service = inject(loginService);
  const authService = inject(AuthService);

  const token = authService.gettoken();

  let headers: any = {
    'ngrok-skip-browser-warning': 'true'
  };

  // Add token if exists
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const authReq = req.clone({
    setHeaders: headers
  });

  return next(authReq);
};
