import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartEventService {
  // Euta event emitter jasle cart update vayo vanera stream garchha
private cartUpdateSubject = new Subject<boolean>();
  cartUpdated$ = this.cartUpdateSubject.asObservable();

  // Yo function components le call garchhan cart ma thapda
  notifyCartUpdate() {
    this.cartUpdateSubject.next(true);
  }
}