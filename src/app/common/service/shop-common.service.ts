

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Endpoint } from './../end-point/shop-Urls';
import { environment } from '../../../environments/environment';


import { finalize, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { CartEventService } from './cart-event.service';


@Injectable({
  providedIn: 'root'
})
export class ShopCommonService {
  private baseurl = environment.apiBaseUrl;
  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
    private cartEventService: CartEventService
  ) { }


  getProductById(id: number) {
    return this.http.get(`${this.baseurl}${Endpoint.getProductById}/${id}`);
  }


  getProductsList() {
    return this.http.get(`${this.baseurl}${Endpoint.getProductList}`);
  }


  getCategoryList() {
    return this.http.get(`${this.baseurl}${Endpoint.category}`);
  }

  postCart(data: any) {
    return this.http.post(`${this.baseurl}${Endpoint.cart}`, data);
  }

  getCartList() {
    return this.http.get(`${this.baseurl}${Endpoint.cartList}`);
  }

  // 🔥 यो एउटा फङ्सनले दुवै कम्पोनेन्टको ६० लाइन कोड बचाउँछ
  addToCart(productId: number, quantity: number): Observable<any> {
    const payload = { productId, quantity };

    return this.http.post(`${this.baseurl}/api/cart`, payload).pipe(
      tap({
        next: (res: any) => {
          // १. साइडबारलाई लिस्ट रिफ्रेश गर्न अलार्म दिने
          this.cartEventService.notifyCartUpdate();
          // २. टोस्टर नोटिफिकेसन देखाउने
          this.toastr.success('Successfully item added to cart');
        },
        error: (err) => {
          // ब्याकइन्डबाट एरर आए टोस्टर देखाउन मन लागे यहाँ थप्न सक्नुहुन्छ
          this.toastr.error(err.error?.message || 'Something went wrong');
        }
      })
    );
  }


}
