import { Injectable } from '@angular/core';

import { Router } from '@angular/router';

import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Endpoint } from './registerUrl';
import { RegisterModel } from './register.model';
@Injectable({
  providedIn: 'root'
})
export class RegisterService {
 baseurl = environment.apiBaseUrl;
 
  constructor(private http: HttpClient) {}

 registerUser(data: RegisterModel) {
  return this.http.post(
    `${this.baseurl}${Endpoint.Register}`,
    data
  );
}
}


