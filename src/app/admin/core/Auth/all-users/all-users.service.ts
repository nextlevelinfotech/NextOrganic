

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { allUsersModel } from './all-users-models';
import { Endpoint } from './all-users-Urls';


@Injectable({
  providedIn: 'root',
})
export class AllUsersService {
  private baseurl = environment.apiBaseUrl;

  allUsersModel: allUsersModel = new allUsersModel();

  constructor(private http: HttpClient) {}

  getCompanyList(){
    return this.http.get(`${this.baseurl}${Endpoint.allUsers}`);
  }
}
