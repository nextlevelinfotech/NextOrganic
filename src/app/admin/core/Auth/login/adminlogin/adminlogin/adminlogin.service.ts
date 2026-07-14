import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EncryptionService } from '../../../encryptionservice/encryption.service';
import { Router } from '@angular/router';

import { Observable } from 'rxjs';

import { Endpoint } from './adminloginUrl';
import { changePswModel, registerModel } from './adminlogin.model';
import { environment } from '../../../../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AdminloginService {
  baseurl = environment.apiBaseUrl;

  changePswModel: changePswModel = new changePswModel();
  registerModel: registerModel = new registerModel();
  

  constructor(
    private http: HttpClient,
    private router: Router,
    private endPoint: Endpoint,
  ) { }


  loginUser(finalData: { username: string; password: string }) {
    return this.http.post(
      `${this.baseurl}${this.endPoint.adminLogin}`,
      finalData,
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



  postRegister(data: any) {
    return this.http.post(`${this.baseurl}${this.endPoint.register}`, data);
  }


}
