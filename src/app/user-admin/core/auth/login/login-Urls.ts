import { Injectable } from "@angular/core"

@Injectable({
  providedIn: 'root'
})

export class Endpoint {

  Login = '/api/Auth/login';
  forgotPassword = '/api/Auth/forgotpassword';
  changePassword = '/api/Auth/reset-password';

  getallusers = '/api/Auth/getallusers'

  getuserbyId = '/api/Auth/getuserbyId?userId='

}

