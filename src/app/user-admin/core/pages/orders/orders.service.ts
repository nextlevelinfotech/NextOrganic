
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { Endpoint } from './orders-Urls';



@Injectable({
  providedIn: 'root',
})
export class OrdersService {

  private baseurl = environment.apiBaseUrl;


  constructor(private http: HttpClient) { }


  getMyorders() {
    return this.http.get(`${this.baseurl}${Endpoint.myorders}`);
  }

  getProductListById(id: number) {
    return this.http.get(`${this.baseurl}${Endpoint.productList}/${id}`);
  }




}
