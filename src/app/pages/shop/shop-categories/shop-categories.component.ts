import { CommonModule } from '@angular/common';
import { AfterViewInit, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../../../header/header.component';
import { FooterComponent } from '../../../footer/footer.component';

@Component({
  selector: 'app-shop-categories',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent, FooterComponent],
  templateUrl: './shop-categories.component.html',
})
export class ShopCategoriesComponent implements AfterViewInit {
  showPopup: boolean = false;

  openPopup(event: Event) {
    event.preventDefault();
    event.stopPropagation();

    this.showPopup = true;
  }

  closePopup() {
    this.showPopup = false;
  }
  minRange!: HTMLInputElement;
  maxRange!: HTMLInputElement;

  minInput!: HTMLInputElement;
  maxInput!: HTMLInputElement;

  minPrice!: HTMLElement;
  maxPrice!: HTMLElement;

  ngAfterViewInit(): void {
    // Get Elements
    this.minRange = document.getElementById('minRange') as HTMLInputElement;
    this.maxRange = document.getElementById('maxRange') as HTMLInputElement;

    this.minInput = document.getElementById('minInput') as HTMLInputElement;
    this.maxInput = document.getElementById('maxInput') as HTMLInputElement;

    this.minPrice = document.getElementById('minPrice') as HTMLElement;
    this.maxPrice = document.getElementById('maxPrice') as HTMLElement;

    // Slider Events
    this.minRange.addEventListener('input', () => {
      this.updatePrice();
    });

    this.maxRange.addEventListener('input', () => {
      this.updatePrice();
    });

    // Input Events
    this.minInput.addEventListener('input', () => {
      this.updateInputs();
    });

    this.maxInput.addEventListener('input', () => {
      this.updateInputs();
    });

    // Initial Update
    this.updatePrice();
  }

  // Update values from range sliders
  updatePrice(): void {
    let minVal = parseInt(this.minRange.value);
    let maxVal = parseInt(this.maxRange.value);

    // Prevent overlap
    if (minVal > maxVal) {
      minVal = maxVal;
      this.minRange.value = minVal.toString();
    }

    if (maxVal < minVal) {
      maxVal = minVal;
      this.maxRange.value = maxVal.toString();
    }

    // Update input fields
    this.minInput.value = minVal.toString();
    this.maxInput.value = maxVal.toString();

    // Update text
    this.minPrice.innerText = minVal.toString();
    this.maxPrice.innerText = maxVal.toLocaleString();
  }

  // Update sliders from inputs
  updateInputs(): void {
    let minVal = parseInt(this.minInput.value);
    let maxVal = parseInt(this.maxInput.value);

    // Prevent overlap
    if (minVal > maxVal) {
      minVal = maxVal;
      this.minInput.value = minVal.toString();
    }

    // Update range sliders
    this.minRange.value = minVal.toString();
    this.maxRange.value = maxVal.toString();

    // Update text
    this.minPrice.innerText = minVal.toString();
    this.maxPrice.innerText = maxVal.toLocaleString();
  }

  // Filter Button Function
  filterPrice(): void {
    const min = this.minInput.value;
    const max = this.maxInput.value;

    alert(`Filtering products between $${min} and $${max}`);

    // Your filter logic here
  }

  products = [
    {
      name: 'Aloe Vera Capsules',
      price: 550,
      image: '../../../assets/img/products/product-img-1.jpg',
      category: 'detox',
    },
    {
      name: 'Aloevera B',
      price: 750,
      image: '../../../assets/img/products/product-img-2.jpg',
      category: 'detox',
    },
    {
      name: 'Cordyceps Capsules',
      price: 2650,
      image: '../../../assets/img/products/product-img-3.jpg',
      category: 'supplements',
    },
    {
      name: 'Gano Black Coffee',
      price: 800,
      image: '../../../assets/img/products/tea/Gango.jpg',
      category: 'tea & coffee',
    },
    {
      name: 'Ganoderma Green Tea',
      price: 500,
      image: '../../../assets/img/products/tea/Ganoderma.jpg',
      category: 'tea & coffee',
    },
    {
      name: 'Ginseng Black Coffee',
      price: 850,
      image: '../../../assets/img/products/tea/Ginseng.jpg',
      category: 'tea & coffee',
    },
    {
      name: 'Ginseng Green Tea',
      price: 550,
      image: '../../../assets/img/products/tea/Ginseng-Green-Tea.jpg',
      category: 'tea & coffee',
    },
    {
      name: 'Pearl Green Tea',
      price: 500,
      image: '../../../assets/img/products/tea/Pearl.jpg',
      category: 'tea & coffee',
    },
  ];

  filteredProducts = [...this.products];

  filterCategory(category: string) {
    this.filteredProducts =
      category === 'all'
        ? [...this.products]
        : this.products.filter((product) => product.category === category);

    this.currentPage = 1; // Reset to first page
  }

  //pagination
  productsPerPage = 5;
  currentPage = 1;

  get paginatedProducts() {
    const startIndex = (this.currentPage - 1) * this.productsPerPage;
    const endIndex = startIndex + this.productsPerPage;

    return this.filteredProducts.slice(startIndex, endIndex);
  }

  get totalPages(): number[] {
    const pageCount = Math.ceil(
      this.filteredProducts.length / this.productsPerPage,
    );

    return Array.from({ length: pageCount }, (_, i) => i + 1);
  }

  changePage(page: number) {
    if (page < 1 || page > this.totalPages.length) {
      return;
    }

    this.currentPage = page;
  }
}
