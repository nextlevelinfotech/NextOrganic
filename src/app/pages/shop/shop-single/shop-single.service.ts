import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Endpoint } from './shop-single-Urls';
import { environment } from '../../../../environments/environment.development';
@Injectable({
  providedIn: 'root'
})
export class ShopSingleService {
  private baseurl = environment.apiBaseUrl;
  constructor(private http: HttpClient) { }


  getProductById(id: number) {
    return this.http.get(`${this.baseurl}${Endpoint.getProductById}/${id}`);
  }
  postCart(data: any) {
    return this.http.post(`${this.baseurl}${Endpoint.cart}`, data);
  }

}
