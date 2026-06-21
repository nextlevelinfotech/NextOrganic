


import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { cartSidebarModel } from './cart-sidebar.model';
import { Endpoint } from './cart-sidebar-Urls';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root',
})
export class CartSidebarService {
  private baseurl = environment.apiBaseUrl;

  cartSidebarModel: cartSidebarModel = new cartSidebarModel();

  constructor(private http: HttpClient) { }


  getCartList() {
    return this.http.get(`${this.baseurl}${Endpoint.cartList}`);
  }

}
