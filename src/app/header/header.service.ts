

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Endpoint } from './header-Urls';

import { environment } from '../../environments/environment';


// import { allUsersModel } from './all-users-models';


@Injectable({
  providedIn: 'root',
})
export class HeaderService {
  private baseurl = environment.apiBaseUrl;

  constructor(private http: HttpClient) { }



 getCategories() {
    return this.http.get(`${this.baseurl}${Endpoint.category}`);
  }

}
