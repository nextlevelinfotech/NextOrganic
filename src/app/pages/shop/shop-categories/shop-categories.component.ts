import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router, RouterModule, ActivatedRoute } from '@angular/router'; // १. यहाँ ActivatedRoute थपियो
import { HeaderComponent } from '../../../header/header.component';
import { FooterComponent } from '../../../footer/footer.component';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ShopCommonService } from '../../../common/service/shop-common.service';
import { CartEventService } from '../../../common/service/cart-event.service';
import { ProductCardComponent } from '../../../components/product-card/product-card.component';
import { AuthService } from '../../../user-admin/core/auth/authService/auth.service';

declare var $: any;

@Component({
  selector: 'app-shop-categories',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, HeaderComponent, FooterComponent, ProductCardComponent],
  templateUrl: './shop-categories.component.html',
})
export class ShopCategoriesComponent implements AfterViewInit, OnInit {
  showPopup: boolean = false;
  isLoading: boolean = false;

  showSuccessToast: boolean = false;
  categoryList: any[] = [];

  products: any[] = [];
  filteredProducts: any[] = [];

  // Filter tracking variables
  selectedCategoryId: number = 0;
  searchTerm: string = '';

  // Pagination variables
  productsPerPage = 9;
  currentPage = 1;

  singleProduct: any = '';

  //Add to cart
  quantity: number = 1;
  maxQty!: number;
  productId!: number;


  // DOM Elements for Price Slider
  minRange!: HTMLInputElement;
  maxRange!: HTMLInputElement;
  minInput!: HTMLInputElement;
  maxInput!: HTMLInputElement;
  minPrice!: HTMLElement;
  maxPrice!: HTMLElement;

  constructor(
    public service: ShopCommonService,
    private toastr: ToastrService,
    private cartEventService: CartEventService,
    private router: Router,
    private authService: AuthService,
    private route: ActivatedRoute // २. कन्स्ट्रक्टरमा route इन्जेक्ट गरियो (तपाईंको अरू केही नचलाई)
  ) { }


  ngOnInit(): void {
    this.getCategoryList();
    this.fetchProductList();

    // ३. मुख्य थपिएको भाग: हेडरको मेनुबाट आउने क्याटगोरी ID ट्र्याक गर्ने लजिक
    // यसले गर्दा जब युजरले हेडरको क्याटगोरीमा क्लिक गर्छ, यो कम्पोनेन्टले तुरुन्तै प्रडक्ट फिल्टर गर्छ।
    this.route.queryParams.subscribe(params => {
      if (params['id']) {
        this.selectedCategoryId = Number(params['id']);
        this.applyFilters(); // आइडी चेन्ज हुनासाथ फिल्टर एप्लाई गर्ने
      }
    });
  }

  ngAfterViewInit(): void {
    // Get Elements
    this.minRange = document.getElementById('minRange') as HTMLInputElement;
    this.maxRange = document.getElementById('maxRange') as HTMLInputElement;
    this.minInput = document.getElementById('minInput') as HTMLInputElement;
    this.maxInput = document.getElementById('maxInput') as HTMLInputElement;
    this.minPrice = document.getElementById('minPrice') as HTMLElement;
    this.maxPrice = document.getElementById('maxPrice') as HTMLElement;

    // Slider Events - थपिएको: updatePrice पछि applyFilters() चल्छ
    this.minRange.addEventListener('input', () => { this.updatePrice(); this.applyFilters(); });
    this.maxRange.addEventListener('input', () => { this.updatePrice(); this.applyFilters(); });

    // Input Events - थपिएको: updateInputs पछि applyFilters() चल्छ
    this.minInput.addEventListener('input', () => { this.updateInputs(); this.applyFilters(); });
    this.maxInput.addEventListener('input', () => { this.updateInputs(); this.applyFilters(); });

    // Initial Update
    this.updatePrice();
  }

  // --- API Calls ---

  getCategoryList() {
    this.isLoading = true;
    this.service.getCategoryList().subscribe({
      next: (res: any) => {
        this.isLoading = false;
        this.categoryList = res;
      },
      error: (err: any) => { this.isLoading = false; },
    });
  }

  fetchProductList() {
    this.isLoading = true;
    this.service.getProductsList().subscribe({
      next: (res: any) => {
        this.isLoading = false;
        this.products = res;
        this.applyFilters(); // API बाट डाटा आएपछि फिल्टरहरू चल्छन्
      },
      error: (err: any) => { this.isLoading = false; },
      complete: () => { this.isLoading = false; },
    });
  }

  // --- Filter & Search Logic ---

  onSearch(event: any) {
    this.searchTerm = event.target.value.toLowerCase().trim();
    this.applyFilters();
  }

  filterCategory(id: number) {
    this.selectedCategoryId = id;
    this.applyFilters();
  }

  applyFilters() {
    // १. यदि प्रोडक्ट्स खाली छ भने सूची खाली गर्ने
    if (!this.products || this.products.length === 0) {
      this.filteredProducts = [];
      return;
    }

    let tempProducts = [...this.products];

    // २. Apply Category Filter
    if (this.selectedCategoryId !== 0) {
      tempProducts = tempProducts.filter(
        (product) => product.categoryId === this.selectedCategoryId
      );
    }

    // ३. Apply Search Text Filter
    if (this.searchTerm !== '') {
      tempProducts = tempProducts.filter((product) =>
        product.productName?.toLowerCase().includes(this.searchTerm)
      );
    }

    // ४. NEW: Apply Price Filter (मिलाइएको ठाउँ)
    // यदि DOM elements उपलब्ध छन् भने मात्र मूल्य फिल्टर गर्ने
    if (this.minRange && this.maxRange) {
      const minSelectedPrice = parseInt(this.minRange.value) || 0;
      const maxSelectedPrice = parseInt(this.maxRange.value) || Infinity;

      tempProducts = tempProducts.filter((product) => {
        const productPrice = Number(product.price);
        return productPrice >= minSelectedPrice && productPrice <= maxSelectedPrice;
      });
    }

    // ५. Update display array and reset pagination
    this.filteredProducts = tempProducts;
    this.currentPage = 1;
  }

  // --- Pagination Logic ---

  get paginatedProducts() {
    const startIndex = (this.currentPage - 1) * this.productsPerPage;
    const endIndex = startIndex + this.productsPerPage;
    return this.filteredProducts.slice(startIndex, endIndex);
  }

  get totalPages(): number[] {
    const pageCount = Math.ceil(this.filteredProducts.length / this.productsPerPage);
    return Array.from({ length: pageCount }, (_, i) => i + 1);
  }

  changePage(page: number) {
    if (page < 1 || page > this.totalPages.length) return;
    this.currentPage = page;
  }

  // --- UI Interactions ---

  openPopup(packet: any) {
    debugger
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

  updatePrice(): void {
    let minVal = parseInt(this.minRange.value);
    let maxVal = parseInt(this.maxRange.value);

    if (minVal > maxVal) {
      minVal = maxVal;
      this.minRange.value = minVal.toString();
    }
    if (maxVal < minVal) {
      maxVal = minVal;
      this.maxRange.value = maxVal.toString();
    }

    this.minInput.value = minVal.toString();
    this.maxInput.value = maxVal.toString();
    this.minPrice.innerText = minVal.toString();
    this.maxPrice.innerText = maxVal.toLocaleString();
  }

  updateInputs(): void {
    let minVal = parseInt(this.minInput.value);
    let maxVal = parseInt(this.maxInput.value);

    if (minVal > maxVal) {
      minVal = maxVal;
      this.minInput.value = minVal.toString();
    }

    this.minRange.value = minVal.toString();
    this.maxRange.value = maxVal.toString();
    this.minPrice.innerText = minVal.toString();
    this.maxPrice.innerText = maxVal.toLocaleString();
  }

  // यसको साटो अब रियल-टाइम फिल्टर काम गर्छ, तर बटन राच्छुहाल्नुभएको छ भने यो प्रयोग गर्न सक्नुहुन्छ
  filterPrice(): void {
    this.applyFilters();
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
        // --- यहाँ कल गर्नुहोस् ---
        // SIDEBAR LAI UPDATE GARAUNA YO TRIGGGER THAPNE

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

        this.isLoading = false; //   unlock button after response
      },
    });
  }
}