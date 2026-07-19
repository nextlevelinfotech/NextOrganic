import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnInit } from '@angular/core';
import { ProductsService } from './products.service';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import Swal from 'sweetalert2';
import {
  ClassicEditor,
  Essentials,
  Bold,
  Italic,
  Paragraph,
  Heading,
  List,
  Link,
  Table,
  TableToolbar
} from 'ckeditor5';

declare var $: any;
import 'select2';

@Component({
  selector: 'app-products',
  imports: [CommonModule, FormsModule, CKEditorModule],
  templateUrl: './products.component.html'
})
export class ProductsComponent implements OnInit, AfterViewInit {
  public Editor = ClassicEditor;
  text: string = 'Add Product'

  // Filter tracking variables
  searchTerm: string = '';

  // Pagination variables
  productsPerPage = 4;
  currentPage = 1;

  public config = {
    licenseKey: 'GPL',
    plugins: [
      Essentials,
      Bold,
      Italic,
      Paragraph,
      Heading,
      List,
      Link,
      Table,
      TableToolbar
    ],
    toolbar: [
      'heading',
      '|',
      'bold',
      'italic',
      '|',
      'bulletedList',
      'numberedList',
      '|',
      'link',
      'insertTable',
      '|',
      'undo',
      'redo'
    ]
  };

  // ==========================================
  // LIST VARIABLES
  // ==========================================
  allProducts: any[] = [];       // API bata aeko full list
  filteredProducts: any[] = [];  // search pachhiko list
  paginatedProducts: any[] = []; // current page ko list (template ma yo use huncha)

  isLoading: boolean = false;
  categoryList: any[] = [];

  // Image Upload Variables
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;

  // Track selected product ID for editing
  selectedProductId: number | null = null;

  constructor(
    public service: ProductsService,
    private toastr: ToastrService,
    private el: ElementRef
  ) { }

  ngOnInit(): void {
    this.fetchProductList();
    this.getCategoryList();
  }

  ngAfterViewInit(): void {
    $(this.el.nativeElement).find('select').select2();
  }

  // ==========================================
  // FETCH PRODUCT LIST
  // ==========================================
  fetchProductList() {
    this.isLoading = true;
    this.service.getProductsList().subscribe({
      next: (res: any) => {
        this.allProducts = res;
        this.isLoading = false;
        this.applyFilters(); // search + pagination lagaune
      },
      error: (err: any) => {
        console.error(err);
        this.isLoading = false;
      }
    });
  }

  // ==========================================
  // SEARCH FUNCTION
  // ==========================================
  onSearch(event: any): void {
    this.searchTerm = event.target.value?.trim().toLowerCase() || '';
    this.currentPage = 1; // search garda page 1 ma jane
    this.applyFilters();
  }

  // ==========================================
  // FILTER + PAGINATION APPLY
  // ==========================================
  applyFilters(): void {
    // 1. Search filter
    if (this.searchTerm) {
      this.filteredProducts = this.allProducts.filter(item =>
        item.productName?.toLowerCase().includes(this.searchTerm) ||
        item.categoryName?.toLowerCase().includes(this.searchTerm) ||
        item.shortDescription?.toLowerCase().includes(this.searchTerm)
      );
    } else {
      this.filteredProducts = [...this.allProducts];
    }

    // 2. Pagination apply
    this.updatePaginatedProducts();
  }

  updatePaginatedProducts(): void {
    const startIndex = (this.currentPage - 1) * this.productsPerPage;
    const endIndex = startIndex + this.productsPerPage;
    this.paginatedProducts = this.filteredProducts.slice(startIndex, endIndex);
  }

  // ==========================================
  // PAGINATION HELPERS
  // ==========================================
  get totalPages(): number {
    return Math.ceil(this.filteredProducts.length / this.productsPerPage);
  }

  getPagesArray(): number[] {
    const pages: number[] = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  changePage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.updatePaginatedProducts();
  }

  // ==========================================
  // GET CATEGORY LIST
  // ==========================================
  getCategoryList() {
    this.service.getCategoryList().subscribe({
      next: (res: any) => {
        this.categoryList = res;
        this.categoryList = this.categoryList.filter((item: any) => item.isActive === true);
      },
      error: (err: any) => {
        console.error(err);
      }
    });
  }

  // File Selection & Preview
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  // ==========================================
  // FORM VALIDATION
  // ==========================================
  validateProduct(): boolean {
    const categoryRaw = $("#product-category").val();
    const categoryId = categoryRaw ? Number(categoryRaw) : 0;
    const isActiveRaw = $("#IsActive").val();

    if (!this.service.productsModel.ProductName?.trim()) {
      this.toastr.error('Product Name is required');
      return false;
    }

    if (!categoryId || categoryId === 0) {
      this.toastr.error('Please select a valid Category');
      return false;
    }

    if (!this.service.productsModel.Price || this.service.productsModel.Price == 0) {
      this.toastr.error('Price must be greater than 0');
      return false;
    }

    if (
      this.service.productsModel.StockQuantity === null ||
      this.service.productsModel.StockQuantity === undefined ||
      this.service.productsModel.StockQuantity == 0 ||
      isNaN(Number(this.service.productsModel.StockQuantity))
    ) {
      this.toastr.error('Valid Stock Quantity is required ');
      return false;
    }

    if (!isActiveRaw || isActiveRaw.toString().trim() === '') {
      this.toastr.error('Please select status field (Is Active)');
      return false;
    }

    if (!this.service.productsModel.Description?.trim() || this.service.productsModel.Description === '<p>&nbsp;</p>') {
      this.toastr.error('Description is required');
      return false;
    }

    if (!this.service.productsModel.shortDescription?.trim()) {
      this.toastr.error('Short Description is required');
      return false;
    }

    return true;
  }

  // ==========================================
  // SAVE / UPDATE PRODUCT
  // ==========================================
  saveProduct() {
    if (!this.validateProduct()) {
      return;
    }

    if (!this.selectedProductId && !this.selectedFile) {
      this.toastr.error('Product Image is required');
      return;
    }


    const categoryId = Number($("#product-category").val());
    const formData = new FormData();

    if (this.selectedProductId) {
      formData.append('id', String(this.selectedProductId));
    }

    formData.append('productName', this.service.productsModel.ProductName.trim());
    formData.append('description', this.service.productsModel.Description.trim());
    formData.append('shortDescription', this.service.productsModel.shortDescription.trim());
    formData.append('price', String(this.service.productsModel.Price));
    formData.append('stockQuantity', String(this.service.productsModel.StockQuantity));
    formData.append('categoryId', String(categoryId));
    formData.append('isActive', $("#IsActive").val());
    formData.append('discountPrice', String(this.service.productsModel.DiscountPrice || 0));

    if (this.selectedFile) {
      formData.append('productImage', this.selectedFile);
    }

    this.isLoading = true;

    if (this.selectedProductId) {
      this.service.updateProduct(this.selectedProductId, formData).subscribe({
        next: () => {
          this.toastr.success('Product updated successfully');
          this.fetchProductList();
          this.reset();
          this.isLoading = false;
          this.text = 'Add  Product'

        },
        error: (err) => {
          console.error(err);
          this.isLoading = false;

          this.text = 'Add Product'
        }
      });
    } else {
      this.service.postProduct(formData).subscribe({
        next: (res: any) => {
          this.toastr.success('Product added successfully');
          this.fetchProductList();
          this.reset();
          this.isLoading = false;
        },
        error: (err: any) => {
          console.error(err);
          this.isLoading = false;
        }
      });
    }
  }




  // ==========================================
  // EDIT MODE
  // ==========================================
  getProductId(ID: number) {
    this.isLoading = true;
    this.selectedProductId = ID;
    this.text = 'Update Product'
    this.service.getProductById(ID).subscribe({
      next: (res: any) => {
        this.service.productsModel = {
          Id: res.id ?? 0,
          ProductName: res.productName ?? '',
          Description: res.description ?? '',
          Price: res.price ?? 0,
          StockQuantity: res.stockQuantity ?? 0,
          CategoryId: res.categoryId ?? 0,
          ProductImage: res.productImage ?? '',
          ProductImages: [],
          DiscountPrice: res.discountPrice ?? 0,
          IsActive: res.isActive ?? true,
          shortDescription: res.shortDescription ?? ''
        };
        this.imagePreview = res.productImageUrl || res.ProductImageUrl;
        this.selectedFile = null;

        setTimeout(() => {
          const catId = res.categoryId || res.CategoryId;
          $('#product-category').val(catId).trigger('change');
        }, 0);

        setTimeout(() => {
          const IsActiveValue = String(res.isActive ?? res.IsActive);
          $('#IsActive').val(IsActiveValue).trigger('change');
        }, 0);

        this.isLoading = false;
      },
      error: (err: any) => {
        console.error(err);
        this.isLoading = false;
      }
    });
  }

  // ==========================================
  // DELETE PRODUCT
  // ==========================================
  // deleteProduct(ID: number) {
  //   if (!confirm('Are you sure you want to delete this product?')) return;

  //   this.isLoading = true;
  //   this.service.deleteProduct(ID).subscribe({
  //     next: (res: any) => {
  //       this.toastr.success('Item removed from Product');
  //       this.fetchProductList();
  //       this.isLoading = false;
  //     },
  //     error: (err: any) => {
  //       console.error(err);
  //       this.isLoading = false;
  //     }
  //   });
  // }
// ==========================================
// DELETE PRODUCT
// ==========================================
deleteProduct(ID: number) {
  Swal.fire({
    title: 'Delete Product?',
    text: 'Are you sure you want to delete this product?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, Delete',
    cancelButtonText: 'Cancel',
    reverseButtons: true,
    confirmButtonColor: '#dc3545',
    cancelButtonColor: '#6c757d'
  }).then((result) => {

    if (result.isConfirmed) {
      this.isLoading = true;

      this.service.deleteProduct(ID).subscribe({
        next: (res: any) => {
          this.toastr.success('Item removed from Product');
          this.fetchProductList();
          this.isLoading = false;
        },
        error: (err: any) => {
          console.error(err);
          this.toastr.error('Failed to delete product');
          this.isLoading = false;
        }
      });
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      this.toastr.error('Delete cancelled');
    }

  });
}


  // ==========================================
  // RESET FORM
  // ==========================================
  reset() {
    this.service.productsModel = {
      Id: 0,
      ProductName: '',
      Description: '',
      Price: 0,
      StockQuantity: 0,
      CategoryId: 0,
      ProductImage: '',
      ProductImages: [],
      DiscountPrice: 0,
      IsActive: false,
      shortDescription: ''
    };

    this.imagePreview = null;
    this.selectedFile = null;
    this.selectedProductId = null;

    $('input[type="file"]').val('');
    $('#product-category').val(' ').trigger('change');
    $('#IsActive').val(' ').trigger('change');
  }
}
