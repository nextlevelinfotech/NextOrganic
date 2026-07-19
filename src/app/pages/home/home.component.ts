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
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../user-admin/core/auth/authService/auth.service';

import Splide from '@splidejs/splide';
import { environment } from '../../../environments/environment';

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
  featuredProducts: any[] = []; // Yedi featured product chuttai dekhauni ho bhane
  isLoading: boolean = false;
  showSuccessToast = false;
  singleProduct: any = '';

  //Add to cart
  quantity: number = 1;
  maxQty!: number;
  productId!: number;

  public baseUrl = environment.apiBaseUrl
  constructor(
    public HomeService: HomeService,
    public service: ShopCommonService,
    private el: ElementRef,
    private toastr: ToastrService,
    private router: Router,
    private authService: AuthService,
    private cartEventService: CartEventService) { }

  ngAfterViewInit(): void {

    setTimeout(() => {
      this.initializedSlider();
    }, 100);

    setTimeout(() => {
      this.initializedImgSlider();
    }, 300);

  }
  ngOnInit(): void {
    this.fetchProductList();
  }


  initializedSlider() {
    new Splide('#imgSlider', {
      type: 'loop',
      perPage: 1,
      gap: '30px',
      autoplay: true,
      interval: 3000,
      arrows: true,
      pagination: true,

      breakpoints: {
        992: {
          perPage: 1,
        },

        576: {
          perPage: 1,
        }
      }

    }).mount();
  }


  initializedImgSlider() {
    new Splide('#benefit-slider', {
      type: 'loop',
      perPage: 1,
      gap: '30px',
      autoplay: true,
      interval: 3000,
      arrows: true,
      pagination: true,
      autoWidth: false,     // यसले जबरजस्ती विड्थ लिने समस्या हटाउँछ
      autoHeight: true,     // इमेजको हाइट अनुसार एडजस्ट गर्छ
      observeMutations: true, // DOM चेन्ज हुँदा स्लाइडर रिफ्रेस गर्छ
      breakpoints: {
        992: {
          perPage: 1,
        },
        576: {
          perPage: 1,
        }
      }
    }).mount();
  }


  fetchProductList() {
    this.isLoading = true;
    this.service.getProductsList().subscribe({
      next: (res: any) => {
        this.isLoading = false;

        // 1. Matrai Active bhayeka products dekhauna:
        this.products = res.filter((product: any) => product.isActive === true);

        // 2. Yedi active pani bhayeko ra isFeatured pani true bhayeko chuttai chainxa bhane:
        // this.featuredProducts = res.filter((product: any) => product.isActive && product.isFeatured);

        console.log(this.products, 'Filtered Active Products');
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

    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      this.toastr.error('Please login to add products to cart');
      this.isLoading = false;
      this.closePopup();
      return;
    }

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
