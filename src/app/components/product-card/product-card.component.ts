import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-card.component.html'
})
export class ProductCardComponent {
  @Input() product: any;
  @Output() addToCartClick = new EventEmitter<any>(); //हामी कार्ड भित्र एउटा घण्टी (EventEmitter) बनाउँछौँ, जसको नाम addToCartClick राखौँ। जसले बाहिर डाटा बोकेर जान्छ


onBasketClick(event: Event) {
  // १. एउटा प्याकेट (Object) भित्र दुवै कुरा प्याक गर्ने
  const packet = {
    clickEvent: event,     
    productData: this.product 
  };
  
  // २. अब .emit() भित्र त्यो 'packet' हालेर बाहिर पठाउने
  this.addToCartClick.emit(packet); 
}
  //  होम पेज हो कि होइन चिन्नको लागि नयाँ इनपुट (Default मा false हुन्छ)
  @Input() isHomePage: boolean = false; 
}

// १. चाइल्डमा (Emit गर्ने):  this.घण्टीको_नाम.emit(जे_पठाउने_हो);
// २. प्यारेन्ट HTML मा:      (घण्टीको_नाम)="फङ्सन($event)"
// ३. प्यारेन्ट TS मा:        फङ्सन(पहिलो_डाटा, दोस्रो_डाटा) { ... }