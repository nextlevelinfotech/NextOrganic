


import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { shopCategoriesModel } from './shop-categories.models';
import { Endpoint } from './shop-categories-Urls';


@Injectable({
  providedIn: 'root',
})
export class ShopCategoriesService {
  private baseurl = environment.apiBaseUrl;

  shopCategoriesModel: shopCategoriesModel = new shopCategoriesModel();

  constructor(private http: HttpClient) { }

  getProductsList() {
    return this.http.get(`${this.baseurl}${Endpoint.getProductList}`);
  }


  getCategoryList() {
    return this.http.get(`${this.baseurl}${Endpoint.category}`);
  }



  postCart(data: any) {
    return this.http.post(`${this.baseurl}${Endpoint.cart}`, data);
  }


}
