import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnInit } from '@angular/core';
import { ProductsService } from './products.service';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
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

  public config = {
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

  productList: any[] = [];
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

  // Fetch Product List
  fetchProductList() {
    this.isLoading = true;
    this.service.getProductsList().subscribe({
      next: (res: any) => {
        this.productList = res;
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error(err);
        this.isLoading = false;
      }
    });
  }

  // Get Category List
  getCategoryList() {
    this.service.getCategoryList().subscribe({
      next: (res: any) => {
        this.categoryList = res;
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
  // १. Form Validation
  // ==========================================
  validateProduct(): boolean {
    const categoryId = Number($("#product-category").val());

    if (!this.service.productsModel.ProductName?.trim()) {
      this.toastr.error('Product Name is required');
      return false;
    }

    if (!this.service.productsModel.Description?.trim()) {
      this.toastr.error('Description is required');
      return false;
    }


    if (!this.service.productsModel.shortDescription?.trim()) {
      this.toastr.error('Short Description is required');
      return false;
    }


    if (!this.service.productsModel.Price || this.service.productsModel.Price <= 0) {
      this.toastr.error('Price must be greater than 0');
      return false;
    }

    if (
      this.service.productsModel.StockQuantity === null ||
      this.service.productsModel.StockQuantity === undefined ||
      this.service.productsModel.StockQuantity < 0
    ) {
      this.toastr.error('Valid Stock Quantity is required');
      return false;
    }

    if (!categoryId) {
      this.toastr.error('Category is required');
      return false;
    }

    return true;
  }


  // ==========================================
  // २. Save / Update Product
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

    // १. अपडेट मोड हो भने सानो अक्षरमा मात्र 'id' पठाउने
    if (this.selectedProductId) {
      formData.append('id', String(this.selectedProductId));
    }


    formData.append('productName', this.service.productsModel.ProductName.trim());
    formData.append('description', this.service.productsModel.Description.trim());
    formData.append('shortDescription', this.service.productsModel.shortDescription.trim());
    formData.append('price', String(this.service.productsModel.Price));
    formData.append('stockQuantity', String(this.service.productsModel.StockQuantity));
    formData.append('categoryId', String(categoryId));

    // ३. बुलिएन भ्यालुहरू - केवल सानो अक्षरमा एउटा मात्र पठाउने ('true' वा 'false')
    // यसले गर्दा भ्यालु डबल (true,true) पनि हुँदैन र ब्याकइन्डले सजिलै बुझ्छ
    const isActiveValue = this.service.productsModel.IsActive ? 'true' : 'false';

    formData.append('isActive', isActiveValue);
    formData.append('discountPrice', String(this.service.productsModel.DiscountPrice || 0));

    if (this.selectedFile) {
      formData.append('productImage', this.selectedFile);
    }

    this.isLoading = true;

    if (this.selectedProductId) {
      // अपडेट गर्ने प्रकृया
      this.service.updateProduct(this.selectedProductId, formData).subscribe({
        next: () => {
          this.toastr.success('Product updated successfully');
          this.fetchProductList();
          this.reset();
          this.isLoading = false;
        },
        error: (err) => {
          console.error(err);
          this.isLoading = false;
        }
      });
    } else {
      // नयाँ थप्ने प्रकृया
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
  // ३. Edit मोडमा फारम भर्ने फङ्सन
  // ==========================================
  getProductId(ID: number) {
    this.isLoading = true;
    this.selectedProductId = ID;

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
          shortDescription: res.ShortDescription

        };
        this.imagePreview = res.productImageUrl || res.ProductImageUrl;
        this.selectedFile = null;

        setTimeout(() => {
          const catId = res.categoryId || res.CategoryId;
          $('#product-category').val(catId).trigger('change');
        }, 0);

        this.isLoading = false;
      },
      error: (err: any) => {
        console.error(err);
        this.isLoading = false;
      }
    });
  }

  // Delete product
  deleteProduct(ID: number) {
    if (!confirm('Are you sure you want to delete this product?')) return;

    this.isLoading = true;
    this.service.deleteProduct(ID).subscribe({
      next: (res: any) => {
        this.toastr.success('Item removed from Product');
        this.fetchProductList();
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error(err);
        this.isLoading = false;
      }
    });
  }

  // Reset Form
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
    $('#product-category').val('').trigger('change');
  }
}