
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { Endpoint } from './login-Urls';
import { loginModel } from './login.model';

@Injectable({
  providedIn: 'root',
})
export class loginService {
  baseurl = environment.apiBaseUrl;

  loginModel: loginModel = new loginModel();


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

  getuserbyId(id: number) {
    return this.http.get(`${this.baseurl}${this.endPoint.getuserbyId}/${id}`);
  }

  getallusers() {
    return this.http.get(`${this.baseurl}${this.endPoint.getallusers}`);
  }



}
