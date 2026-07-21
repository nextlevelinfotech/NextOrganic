import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { HeaderComponent } from '../../../header/header.component';
import { FooterComponent } from '../../../footer/footer.component';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ShopCommonService } from '../../../common/service/shop-common.service';
import { CartEventService } from '../../../common/service/cart-event.service';
import { ProductCardComponent } from '../../../components/product-card/product-card.component';
import { AuthService } from '../../../user-admin/core/auth/authService/auth.service';
import { environment } from '../../../../environments/environment';

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

  public baseUrl = environment.apiBaseUrl


  constructor(
    public service: ShopCommonService,
    private toastr: ToastrService,
    private cartEventService: CartEventService,
    private router: Router,
    private authService: AuthService,
    private route: ActivatedRoute
  ) { }


  ngOnInit(): void {
    this.getCategoryList();
    this.fetchProductList();

    // URL को Query Params परिवर्तन ट्र्याक गर्ने
    this.route.queryParams.subscribe(params => {
      if (params['id']) {
        // यदि URL मा id छ भने (जस्तै: ?id=3)
        this.selectedCategoryId = Number(params['id']);
      } else {
        // 🌟 थपिएको भाग: यदि URL मा id छैन भने (All मा क्लिक गर्दा) 
        // id लाई 0 बनाएर सबै प्रोडक्ट देखाउने
        this.selectedCategoryId = 0;
      }

      this.applyFilters();
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

    // Slider Events 
    this.minRange.addEventListener('input', () => { this.updatePrice(); this.applyFilters(); });
    this.maxRange.addEventListener('input', () => { this.updatePrice(); this.applyFilters(); });

    // Input Events 
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
        this.categoryList = this.categoryList.filter((item: any) => item.isActive === true);
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
        this.applyFilters();
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
    if (!this.products || this.products.length === 0) {
      this.filteredProducts = [];
      return;
    }
    // ओरिजिनल 'products' एरे बिग्रिन नदिन त्यसको एउटा डुप्लिकेट/अस्थायी कपी (tempProducts) बनाउने
    let tempProducts = [...this.products];

    // (यदि selectedCategoryId ० छ भने 'All' भन्ने बुझिन्छ र यो ब्लक स्किप हुन्छ
    // Apply Category Filter
    if (this.selectedCategoryId !== 0) {
      tempProducts = tempProducts.filter(
        (product) => product.categoryId === this.selectedCategoryId
      );
    }

    // Apply Search Text Filter
    if (this.searchTerm !== '') {
      tempProducts = tempProducts.filter((product) =>
        product.productName?.toLowerCase().includes(this.searchTerm)
      );
    }

    // Apply Price Filter 
    if (this.minRange && this.maxRange) {
      const minSelectedPrice = parseInt(this.minRange.value) || 0;
      const maxSelectedPrice = parseInt(this.maxRange.value) || Infinity;

      tempProducts = tempProducts.filter((product) => {
        const productPrice = Number(product.price);
        return productPrice >= minSelectedPrice && productPrice <= maxSelectedPrice;
      });
    }

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

  filterPrice(): void {
    this.applyFilters();
  }

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
        this.showSuccessToast = true;

        setTimeout(() => {
          this.showSuccessToast = false;
          this.closePopup();
        }, 800);
      },
      error: (err: any) => { this.isLoading = false; },
      complete: () => { this.isLoading = false; },
    });
  }

  // ==========================================
  // थपिएको भाग: Breadcrumb Dynamic बनाउने Getter फङ्सन
  // ==========================================
  get selectedCategoryName(): string {
    if (this.selectedCategoryId === 0) {
      return 'All Products';
    }
    // categoryList भित्र selectedCategoryId सँग म्याच हुने अबजेक्ट खोज्छ
    const foundCategory = this.categoryList.find(cat => cat.id === this.selectedCategoryId);

    // यदि फेला पर्यो भने नाम फर्काउँछ, नत्र 'Loading...' देखाउँछ
    return foundCategory ? foundCategory.categoryName : 'Loading...';
  }
}