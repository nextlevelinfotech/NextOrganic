import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Product, ProductsResponse, Category, ProductFilters } from '../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private http = inject(HttpClient);

  // ─── Replace with your real API base URL ───────────────────────────────────
  private readonly BASE_URL = 'https://your-api.com/api';
  // ───────────────────────────────────────────────────────────────────────────

  // Fallback mock data used when the API is unreachable during development
  private mockCategories: Category[] = [
    { id: 1, name: 'Detox Products', slug: 'detox-products' },
    { id: 2, name: 'Agro Products', slug: 'agro-products' },
    { id: 3, name: 'Food Supplements', slug: 'food-supplements' },
    { id: 4, name: 'Hair Care', slug: 'hair-care' },
    { id: 5, name: 'Oral Care', slug: 'oral-care' },
    { id: 6, name: 'Personal Care', slug: 'personal-care' },
    { id: 7, name: 'Skin Care', slug: 'skin-care' },
    { id: 8, name: 'Tea & Coffee', slug: 'tea-coffee' },
  ];

  private mockProducts: Product[] = [
    { id: 1, name: 'Aloe Vera Capsules', image: 'assets/img/products/product-img-1.jpg', price: 550, originalPrice: 850, category: 'food-supplements', inStock: 10 },
    { id: 2, name: 'Aloevera B', image: 'assets/img/products/product-img-2.jpg', price: 750, originalPrice: 850, category: 'food-supplements', inStock: 5 },
    { id: 3, name: 'Cordyceps Capsules', image: 'assets/img/products/product-img-3.jpg', price: 2650, originalPrice: 2750, category: 'food-supplements', inStock: 8 },
    { id: 4, name: 'Ganoderma Capsules', image: 'assets/img/products/product-img-4.jpg', price: 1600, originalPrice: 1800, category: 'detox-products', inStock: 3 },
    { id: 5, name: 'Alfa Alfa', image: 'assets/img/products/product-img-5.jpg', price: 1050, originalPrice: 1150, category: 'agro-products', inStock: 20 },
    { id: 6, name: 'Curcumin', image: 'assets/img/products/product-img-6.jpg', price: 4000, originalPrice: 5000, category: 'food-supplements', inStock: 7 },
    { id: 7, name: 'Ganoderma', image: 'assets/img/products/product-img-7.jpg', price: 1650, originalPrice: 1850, category: 'detox-products', inStock: 12 },
    { id: 8, name: 'Gcombogia', image: 'assets/img/products/product-img-8.jpg', price: 1600, originalPrice: 1800, category: 'agro-products', inStock: 2 },
    { id: 9, name: 'Gingano Pleasure', image: 'assets/img/products/product-img-8.jpg', price: 1600, originalPrice: 1800, category: 'soap', inStock: 2 },

  ];

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.BASE_URL}/categories`).pipe(
      catchError(() => of(this.mockCategories))
    );
  }

  getProducts(filters: ProductFilters = {}): Observable<ProductsResponse> {
    let params = new HttpParams();
    if (filters.category) params = params.set('category', filters.category);
    if (filters.minPrice !== undefined) params = params.set('minPrice', filters.minPrice);
    if (filters.maxPrice !== undefined) params = params.set('maxPrice', filters.maxPrice);
    if (filters.search) params = params.set('search', filters.search);
    if (filters.sortBy) params = params.set('sortBy', filters.sortBy);
    if (filters.limit) params = params.set('limit', filters.limit);
    if (filters.page) params = params.set('page', filters.page);

    return this.http
      .get<ProductsResponse>(`${this.BASE_URL}/products`, { params })
      .pipe(catchError(() => of(this._applyMockFilters(filters))));
  }

  getProductById(id: number): Observable<Product | undefined> {
    return this.http.get<Product>(`${this.BASE_URL}/products/${id}`).pipe(
      catchError(() => of(this.mockProducts.find((p) => p.id === id)))
    );
  }

  // ── Local mock filtering so the UI is fully functional offline ─────────────
  private _applyMockFilters(filters: ProductFilters): ProductsResponse {
    let results = [...this.mockProducts];

    if (filters.category) {
      results = results.filter((p) => p.category === filters.category);
    }
    if (filters.minPrice !== undefined) {
      results = results.filter((p) => p.price >= filters.minPrice!);
    }
    if (filters.maxPrice !== undefined) {
      results = results.filter((p) => p.price <= filters.maxPrice!);
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      results = results.filter((p) => p.name.toLowerCase().includes(q));
    }
    if (filters.sortBy === 'Name') {
      results.sort((a, b) => a.name.localeCompare(b.name));
    } else if (filters.sortBy === 'Price') {
      results.sort((a, b) => a.price - b.price);
    }

    const limit = filters.limit ?? 6;
    const page = filters.page ?? 1;
    const start = (page - 1) * limit;
    const paginated = results.slice(start, start + limit);

    return { products: paginated, total: results.length, page, limit };
  }
}
