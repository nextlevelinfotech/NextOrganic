import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs'; // 🌟 Subject को सट्टा BehaviorSubject

@Injectable({
  providedIn: 'root'
})
export class CartEventService {
  // 🌟 null बाट सुरु गर्ने ताकि पहिलो पटक पेज लोड हुँदा थाहा होस्
  private cartUpdateSubject = new BehaviorSubject<any>(null);
  cartUpdated$ = this.cartUpdateSubject.asObservable();

  // 🌟 भ्यालु आउँदा पास गर्ने, नआउँदा ट्रु (true) मान्ने
  notifyCartUpdate(data: any = true) {
    this.cartUpdateSubject.next(data);
  }
}