import { Component, AfterViewInit, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { RedZoomModule } from 'ngx-red-zoom';
import { ActivatedRoute, RouterModule } from '@angular/router';
import Splide from '@splidejs/splide';
import { HeaderComponent } from '../../../header/header.component';
import { FooterComponent } from '../../../footer/footer.component';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ShopCommonService } from '../../../common/service/shop-common.service';
import { CartEventService } from '../../../common/service/cart-event.service';
import { ProductCardComponent } from '../../../components/product-card/product-card.component';

@Component({
  selector: 'app-shop-single',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTabsModule,
    RedZoomModule,
    HeaderComponent,
    FooterComponent,
    ProductCardComponent,
    RouterModule
  ],
  templateUrl: './shop-single.component.html',
})
export class ShopSingleComponent implements AfterViewInit, OnInit {

  isLoading: boolean = false;
  productId!: number;
  product: any;

  showPopup: boolean = false;
  products: any[] = [];
  showSuccessToast = false;
  singleProduct: any = '';


  //Add to cart
  quantity: number = 1;
  maxQty!: number;

  constructor(private route: ActivatedRoute, public service: ShopCommonService, private toastr: ToastrService,
    private cartEventService: CartEventService) { }

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

  images = [
    {
      id: 'img1',
      // thumb: 'assets/img/products/product-img-big.png',
      // full: 'assets/img/products/product-img-big.png',
      thumb: 'https://scompiler.github.io/red-zoom-angular/assets/image-1.jpg',
      full: 'https://wittlock.github.io/ngx-image-zoom/assets/fullres.jpg',
      alt: 'Front',
    },
    {
      id: 'img2',
      thumb: 'assets/img/products/product-img-2.jpg',
      full: 'assets/img/products/product-img-2.jpg',
      alt: 'Side',
    },
    {
      id: 'img3',
      thumb: 'assets/img/products/product-img-3.jpg',
      full: 'assets/img/products/product-img-3.jpg',
      alt: 'Back',
    },
  ];

  ngOnInit(): void {
    this.fetchProductList();

    this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));
      this.productId = id;

      this.service.getProductById(id).subscribe({
        next: (res: any) => {
          this.product = res;
          this.maxQty = res.stockQuantity; // 🔥 FIX
        }
      });
    });
  }
  ngAfterViewInit(): void {

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

        this.isLoading = false;
        // SIDEBAR LAI UPDATE GARAUNA YO TRIGGGER THAPNE
        this.cartEventService.notifyCartUpdate();

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
