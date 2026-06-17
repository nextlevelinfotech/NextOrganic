

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { productsModel } from './products.models';
import { Endpoint } from './products-Urls';


@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private baseurl = environment.apiBaseUrl;

  productsModel: productsModel = new productsModel();

  constructor(private http: HttpClient) { }

  getProductsList() {
    return this.http.get(`${this.baseurl}${Endpoint.products}`);
  }


  postProduct(data: any) {
    return this.http.post(`${this.baseurl}${Endpoint.postProducts}`, data);
  }

  getCategoryList() {
    return this.http.get(`${this.baseurl}${Endpoint.category}`);
  }

}
