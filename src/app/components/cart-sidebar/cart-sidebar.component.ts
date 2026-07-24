import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnInit, OnDestroy } from '@angular/core'; // 🌟 OnDestroy थपियो
import { RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { Subscription } from 'rxjs';
import { CartEventService } from '../../common/service/cart-event.service';
import { ShopCommonService } from '../../common/service/shop-common.service';
import { forkJoin } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../shared-services/authService/auth.service';
declare var jQuery: any;
declare var $: any; // 🌟 $ को एरर नआओस् भन्नका लागि

@Component({
  selector: 'app-cart-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cart-sidebar.component.html',
})
export class CartSidebarComponent implements AfterViewInit, OnInit, OnDestroy {
  isLoading: boolean = false;
  isLocalUpdate: boolean = false; // 🌟 आफ्नै पेजको अलार्म ट्र्याक गर्न थपिएको फ्ल्याग
  cartList: any[] = [];
  cartTotalPrice: number = 0;
  shippingCharge: number = 0;
  private cartSubscription!: Subscription;

  public baseurl = environment.apiBaseUrl;
  constructor(
    public service: ShopCommonService,
    private toastr: ToastrService,
    private authService: AuthService,
    private el: ElementRef,
    private cartEventService: CartEventService
  ) { }

  // ... (तपाईंको माथिको कोड उस्तै) ...
  ngOnInit(): void {
    // 🌟 बाहिरको this.fetchCartList(); हटाइयो

    if (!this.authService.isLoggedIn()) {
      return;
    }

    this.cartSubscription = this.cartEventService.cartUpdated$.subscribe((updated: any) => {
      if (updated !== null && updated !== undefined) {

        if (this.isLocalUpdate) {
          this.isLocalUpdate = false;
          return;
        }

        if (Array.isArray(updated)) {
          this.cartList = updated;
          this.calculateTotalFromList();
        } else {
          this.fetchCartList();
        }
      } else {
        // 🌟 पहिलो पटक एप्लिकेसन खुल्दा मात्र API कल गर्ने
        this.fetchCartList();
      }
    });
  }
  // ... (तपाईंको तलको कोड उस्तै) ...

  ngAfterViewInit(): void {
    this.cartSidebar();
  }

  cartSidebar() {
    $('.cart-close-btn, .body-overlay').on('click', function () {
      $('.cart-sidebar').removeClass('active');
      $('.body-overlay').removeClass('active');
    });

    $('.cart-btn').on('click', function () {
      $('.cart-sidebar').addClass('active');
      $('.body-overlay').addClass('active');
    });
  }

  fetchCartList() {
    this.isLoading = true;
    this.service.getCartList().subscribe({
      next: (res: any) => {
        this.isLoading = false;
        this.cartList = res || [];

        if (this.cartList.length > 0) {
          this.cartTotalPrice = this.cartList.reduce((total: number, item: any) => {
            const price = Number(item.price) || 0;
            const qty = Number(item.quantity) || 1;
            return total + (price * qty);
          }, 0);
        } else {
          this.cartTotalPrice = 0;
        }
      },
      error: (err: any) => { this.isLoading = false; },
      complete: () => { this.isLoading = false; },
    });
  }

  // सिधै लिस्टबाट टोटल हिसाब निकाल्न थपिएको सहयोगी फङ्सन (ताकि एपीआई कल दोहोर्याउनु नपरोस्)
  calculateTotalFromList() {
    if (this.cartList.length > 0) {
      this.cartTotalPrice = this.cartList.reduce((total: number, item: any) => {
        const price = Number(item.price) || 0;
        const qty = Number(item.quantity) || 1;
        return total + (price * qty);
      }, 0);
    } else {
      this.cartTotalPrice = 0;
    }
  }

  deleteProduct(ID: number) {
    this.isLoading = true;
    this.service.deleteCart(ID).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        this.toastr.success('Item removed from cart');

        // अलार्म बजाउनु अघि "यो साइडबार आफैँले गरेको अपडेट हो" भनी मार्क गर्ने
        this.isLocalUpdate = true;

        // फ्रन्टइन्ड लिस्टबाट डिलिट भएको आइटमलाई तुरुन्तै हटाएर नयाँ लिस्ट तयार पार्ने
        this.cartList = this.cartList.filter(item => item.cartDetailId !== ID);
        this.calculateTotalFromList();

        // हेडर र मेन कार्ट पेजलाई यो नयाँ लिस्ट उपहार दिँदै अलार्म बजाउने
        this.cartEventService.notifyCartUpdate(this.cartList);

        // साइडबारको लिस्टलाई तुरुन्तै र सफा रूपमा एकपटक मात्र रिफ्रेस गर्ने
        this.fetchCartList();
      },
      error: (err: any) => {
        this.isLoading = false;
        this.isLocalUpdate = false; // एरर आए फ्ल्याग रिसेट गर्ने
      },
      complete: () => { this.isLoading = false; },
    });
  }

  removeAllItems() {
    if (this.cartList.length === 0) {
      this.toastr.warning('Cart is empty');
      return;
    }
    this.isLoading = true;

    const requests = this.cartList.map((item: any) => {
      return this.service.deleteCart(item.cartDetailId);
    });


    forkJoin(requests).subscribe({
      next: () => {
        this.isLoading = false;
        this.cartList = [];
        this.cartTotalPrice = 0;
        this.isLocalUpdate = true;
        this.cartEventService.notifyCartUpdate([]);
        this.toastr.success(
          'All items removed from cart'
        );

      },

      error: () => {
        this.isLoading = false;
        this.toastr.error(
          'Something went wrong'
        );
      }

    });

  }
  ngOnDestroy(): void {
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
  }
}