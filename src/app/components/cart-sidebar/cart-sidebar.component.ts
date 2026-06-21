import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CartSidebarService } from './cart-sidebar.service';
import { ToastrService } from 'ngx-toastr';

import { Subscription } from 'rxjs';
import { CartEventService } from '../../common/service/cart-event.service';
import { ShopCommonService } from '../../common/service/shop-common.service';
declare var jQuery: any;
@Component({
  selector: 'app-cart-sidebar',
  imports: [CommonModule, RouterModule],
  templateUrl: './cart-sidebar.component.html',
})
export class CartSidebarComponent implements AfterViewInit, OnInit {
  isLoading: boolean = false;
  cartList: any;
  private cartSubscription!: Subscription;
  constructor(
    public service: ShopCommonService,
    private toastr: ToastrService,
    private el: ElementRef,
    private cartEventService: CartEventService, // Inject गर्नुहोस्

  ) { }



  ngAfterViewInit(): void {
    this.cartSidebar();
  }

  ngOnInit(): void {
    this.fetchCartList();
    // यो लाइनले cart अपडेट भएको जानकारी पाउँछ र लिस्ट रिफ्रेश गर्छ
    this.cartSubscription = this.cartEventService.cartUpdated$.subscribe((updated) => {
      if (updated) {
        this.fetchCartList();
      }
    });
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



  // fetchCartList


  fetchCartList() {
    this.isLoading = true;
    this.service.getCartList().subscribe({
      next: (res: any) => {
        console.log(res, 'data herrrr');

        this.isLoading = false;
        this.cartList = res
      },
      error: (err: any) => {
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false; //  unlock button after response
      },
    });
  }
  ngOnDestroy(): void {
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe(); // Memory safety ko lagi
    }
  }


}
