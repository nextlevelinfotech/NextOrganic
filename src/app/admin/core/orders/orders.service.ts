

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { ordersModel } from './orders.models'; // अब एउटै मोडल मात्र चाहिने हुनाले
import { Endpoint } from './orders-Urls';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  private baseurl = environment.apiBaseUrl;

  // अब एउटै साझा 'ordersModel' मात्र राख्ने
  ordersModel: ordersModel = new ordersModel();

  constructor(private http: HttpClient) { }

  getProductList(id: number) {
    return this.http.get(`${this.baseurl}${Endpoint.productList}/${id}`);
  }

  getAllOrders() {
    return this.http.get(`${this.baseurl}${Endpoint.GetAllOrders}`);
  }


}

