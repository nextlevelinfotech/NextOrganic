

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Endpoint } from './home-Urls';
import { environment } from '../../../environments/environment';

// import { allUsersModel } from './all-users-models';


@Injectable({
  providedIn: 'root',
})
export class HomeService {
  private baseurl = environment.apiBaseUrl;

  // allUsersModel: allUsersModel = new allUsersModel();

  constructor(private http: HttpClient) { }


}
