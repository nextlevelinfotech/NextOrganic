
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { Endpoint } from './login-Urls';
import { changePswModel, loginModel } from './login.model';

@Injectable({
  providedIn: 'root',
})
export class loginService {
  baseurl = environment.apiBaseUrl;

  loginModel: loginModel = new loginModel();
  changePswModel: changePswModel = new changePswModel();


  constructor(
    private http: HttpClient,
    private router: Router,
    private endPoint: Endpoint,
  ) { }


  loginUser(data: any) {
    return this.http.post(
      `${this.baseurl}${this.endPoint.Login}`,
      data,
    );
  }


  forgotPassword(email: string) {
    return this.http.post(
      `${this.baseurl}${this.endPoint.forgotPassword}?email=${email}`,
      {},
      { responseType: 'text' },
    );
  }

  changePassword(data: any) {
    const params = new HttpParams()
      .set('email', data.email)
      .set('otp', data.otp)
      .set('newPassword', data.newPassword);

    return this.http.post(
      `${this.baseurl}/api/Auth/reset-password`,
      {},
      { params, responseType: 'text' }, // 👈 important if backend returns plain text
    );
  }




  getuserbyId(id: number) {
    return this.http.get(`${this.baseurl}${this.endPoint.getuserbyId}${id}`);
  }

  getallusers() {
    return this.http.get(`${this.baseurl}${this.endPoint.getallusers}`);
  }



}
