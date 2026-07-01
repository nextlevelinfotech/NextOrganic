import { AfterViewInit, Component, ElementRef, OnInit } from '@angular/core';
declare var $: any;
import { HeaderComponent } from '../../header/header.component';
import { FooterComponent } from '../../footer/footer.component';
import { HomeService } from './home.service';
import { ToastrService } from 'ngx-toastr';
import { ShopCommonService } from '../../common/service/shop-common.service';
import { CommonModule } from '@angular/common';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { FormsModule } from '@angular/forms';
import { CartEventService } from '../../common/service/cart-event.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    HeaderComponent,
    FooterComponent,
    CommonModule,
    FormsModule,
    RouterModule,
    ProductCardComponent
  ],
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit, AfterViewInit {
  showPopup: boolean = false;
  products: any[] = [];
  isLoading: boolean = false;
  showSuccessToast = false;
  singleProduct: any = '';

  //Add to cart
  quantity: number = 1;
  maxQty!: number;
  productId!: number;


  constructor(
    public HomeService: HomeService,
    public service: ShopCommonService,
    private el: ElementRef,
    private toastr: ToastrService,
    private cartEventService: CartEventService) { }

  ngAfterViewInit(): void {
  }
  ngOnInit(): void {
    this.fetchProductList();
  }



  fetchProductList() {
    this.isLoading = true;
    this.service.getProductsList().subscribe({
      next: (res: any) => {
        this.isLoading = false;
        this.products = res;
        console.log("product list", res)
      },
      error: (err: any) => { this.isLoading = false; },
      complete: () => { this.isLoading = false; },
    });
  }


  openPopup(packet: any) {
    // packet भित्रबाट क्लिक इभेन्ट र प्रोडक्ट डाटा छुट्टाछुट्टै निकाल्ने
    const event = packet.clickEvent;
    const product = packet.productData;

    event.preventDefault();
    event.stopPropagation();

    this.showPopup = true;
    this.singleProduct = product;
    this.productId = product.id;
    this.maxQty = product.stockQuantity;
  }
  closePopup() {
    this.showPopup = false;
  }



  // Add to cart

  decrease() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  increase() {

    if (this.quantity < this.maxQty) {
      this.quantity++;
    }
  }


  createCart() {
    let payload = {
      productId: this.productId,
      quantity: this.quantity
    }

    this.isLoading = true;
    this.service.postCart(payload).subscribe({
      next: (res: any) => {

        this.cartEventService.notifyCartUpdate(true);

        this.fetchProductList();
        this.isLoading = false;

        // Success Toast
        this.showSuccessToast = true;

        setTimeout(() => {
          this.showSuccessToast = false;
          this.closePopup();   // 1 sec पछि popup पनि बन्द हुन्छ
        }, 800);

      },
      error: (err: any) => {
        this.isLoading = false;
      },
      complete: () => {

        this.isLoading = false; //  unlock button after response
      },
    });
  }



}
