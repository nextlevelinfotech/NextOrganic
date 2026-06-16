

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Endpoint } from './home-Urls';

// import { allUsersModel } from './all-users-models';


@Injectable({
  providedIn: 'root',
})
export class HomeService {
  private baseurl = environment.apiBaseUrl;

  // allUsersModel: allUsersModel = new allUsersModel();

  constructor(private http: HttpClient) { }

  getProductList() {
    return this.http.get(`${this.baseurl}${Endpoint.getProductList}`);
  }
}
