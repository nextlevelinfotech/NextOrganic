import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { productsModel } from './products.models'; // अब एउटै मोडल मात्र चाहिने हुनाले
import { Endpoint } from './products-Urls';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private baseurl = environment.apiBaseUrl;

  // अब एउटै साझा 'productsModel' मात्र राख्ने
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

  getProductById(id: number) {
    return this.http.get(`${this.baseurl}${Endpoint.productById}/${id}`);
  }

  deleteProduct(id: number) {
    return this.http.delete(`${this.baseurl}${Endpoint.deleteProduct}/${id}`);
  }

  updateProduct(id: number, product: any) {
    return this.http.put(`${this.baseurl}${Endpoint.updateProduct}/${id}`, product);
  }
}

