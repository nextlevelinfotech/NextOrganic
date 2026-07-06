

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { environment } from '../../../../../environments/environment';
import { registerModel } from './register.model';
import { Endpoint } from './register-Urls';

@Injectable({
  providedIn: 'root',
})
export class RegisterService {
  baseurl = environment.apiBaseUrl;

  registerModel: registerModel = new registerModel();


  constructor(
    private http: HttpClient,
    private router: Router,
    private endPoint: Endpoint,
  ) { }


  postRegister(data: any) {
    return this.http.post(`${this.baseurl}${this.endPoint.register}`, data);
  }


}
