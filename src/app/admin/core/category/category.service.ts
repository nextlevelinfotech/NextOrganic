

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { categoryModel } from './category.models'; // अब एउटै मोडल मात्र चाहिने हुनाले
import { Endpoint } from './category-Urls';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private baseurl = environment.apiBaseUrl;

  // अब एउटै साझा 'productsModel' मात्र राख्ने
  categoryModel: categoryModel = new categoryModel();

  constructor(private http: HttpClient) { }

  getCategories() {
    return this.http.get(`${this.baseurl}${Endpoint.category}`);
  }

  getCategoryById(id: number) {
    return this.http.get(`${this.baseurl}${Endpoint.categoryId}/${id}`);
  }


  postCategory(data: any) {
    return this.http.post(`${this.baseurl}${Endpoint.postCategory}`, data);
  }


  deleteCategory(id: number) {
    return this.http.delete(`${this.baseurl}${Endpoint.deleteCategory}/${id}`);
  }


  updateCategory(id: number, product: any) {
    return this.http.put(`${this.baseurl}${Endpoint.updateCategory}/${id}`, product);
  }

  //   deletecategory(id: number) {
  //   return this.http.delete(`${this.baseurl}${Endpoint.deleteProduct}/${id}`);
  // }



  // getProductsList() {
  //   return this.http.get(`${this.baseurl}${Endpoint.products}`);
  // }

  // postProduct(data: any) {
  //   return this.http.post(`${this.baseurl}${Endpoint.postProducts}`, data);
  // }

  // getCategoryList() {
  //   return this.http.get(`${this.baseurl}${Endpoint.category}`);
  // }

  // getProductById(id: number) {
  //   return this.http.get(`${this.baseurl}${Endpoint.productById}/${id}`);
  // }

  // deleteProduct(id: number) {
  //   return this.http.delete(`${this.baseurl}${Endpoint.deleteProduct}/${id}`);
  // }

  // updateProduct(id: number, product: any) {
  //   return this.http.put(`${this.baseurl}${Endpoint.updateProduct}/${id}`, product);
  // }
}

