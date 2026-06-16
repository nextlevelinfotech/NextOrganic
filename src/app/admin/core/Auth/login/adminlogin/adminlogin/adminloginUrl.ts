import { Injectable } from "@angular/core"

@Injectable({
  providedIn: 'root'
})

export class Endpoint {

     adminLogin = '/api/Auth/login';
     forgotPassword = '/api/Auth/forgotpassword';
     changePassword = '/api/Auth/reset-password';

}

