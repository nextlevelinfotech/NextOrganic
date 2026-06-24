import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnInit } from '@angular/core';
import { ProductsService } from './products.service';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
declare var $: any;
import 'select2';
@Component({
  selector: 'app-products',
  imports: [CommonModule, FormsModule],
  templateUrl: './products.component.html'
})
export class ProductsComponent implements OnInit, AfterViewInit {
  productList: any[] = [];
  isLoading: boolean = false;
  categoryList: any[] = [];

  constructor(
    public service: ProductsService,
    private toastr: ToastrService,
    private el: ElementRef,

  ) { }



  ngOnInit(): void {
    this.fetchProductList();
    this.getCategoryList();
  }
  ngAfterViewInit(): void {
    $(this.el.nativeElement).find('select').select2();
  }


  //fetechProductList
  fetchProductList() {
    this.isLoading = true;
    this.service.getProductsList().subscribe({
      next: (res: any) => {
        console.log(res, 'data g');

        this.isLoading = false;
        this.productList = res
      },
      error: (err: any) => {
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false; //  unlock button after response
      },
    });
  }

  // onFileSelected(event: any) {
  //   const file = event.target.files[0];

  //   if (file) {
  //     const reader = new FileReader();

  //     reader.onload = () => {
  //       this.service.productsModel.ProductImage =
  //         reader.result as string;
  //     };

  //     reader.readAsDataURL(file);
  //   }
  // }


  // Image Upload ===========================================================

  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;

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
  resetImage(): void {
    this.imagePreview = null;
  }

  // Image Upload End===========================================================


  //getCategoryList

  getCategoryList() {
    this.service.getCategoryList().subscribe({
      next: (res: any) => {
        console.log(res, 'data here');
        this.isLoading = false;
        this.categoryList = res
      },
      error: (err: any) => {
        this.isLoading = false;
      },
    })
  }


  //create Product
  // postProduct() {

  //   let payload = {
  //     ProductName: this.service.productsModel.ProductName,
  //     Description: this.service.productsModel.Description,
  //     Price: this.service.productsModel.Price,
  //     StockQuantity: this.service.productsModel.StockQuantity,
  //     CategoryId: Number($("#product-category").val()),
  //     ProductImage: this.imagePreview,
  //     ProductImages: []
  //   };

  //   this.isLoading = true;
  //   this.service.postProduct(payload).subscribe({
  //     next: (res: any) => {
  //       console.log(res, 'data');
  //       this.isLoading = false;
  //       this.fetchProductList();
  //     },
  //     error: (err: any) => {
  //       this.isLoading = false;
  //     },
  //     complete: () => {
  //       this.isLoading = false; //  unlock button after response
  //     },
  //   });
  // }

  postProduct() {

    // ===== VALIDATION START =====
    if (!this.service.productsModel.ProductName?.trim()) {
      this.toastr.error('Product Name is required');
      return;
    }

    if (!this.service.productsModel.Description?.trim()) {
      this.toastr.error('Description is required');
      return;
    }

    if (!this.service.productsModel.Price || this.service.productsModel.Price <= 0) {
      this.toastr.error('Price must be greater than 0');
      return;
    }

    if (!this.service.productsModel.StockQuantity || this.service.productsModel.StockQuantity < 0) {
      this.toastr.error('Stock Quantity is required');
      return;
    }

    const categoryId = Number($("#product-category").val());
    if (!categoryId) {
      this.toastr.error('Category is required');
      return;
    }

    if (!this.selectedFile) {
      this.toastr.error('Product Image is required');
      return;
    }
    // ===== VALIDATION END =====


    console.log('MODEL:', this.service.productsModel);

    const formData = new FormData();

    formData.append('ProductName', this.service.productsModel.ProductName.trim());
    formData.append('Description', this.service.productsModel.Description.trim());
    formData.append('Price', String(this.service.productsModel.Price));
    formData.append('StockQuantity', String(this.service.productsModel.StockQuantity));
    formData.append('CategoryId', String(categoryId));

    formData.append('ProductImage', this.selectedFile);

    for (const pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }

    this.isLoading = true;

    this.service.postProduct(formData).subscribe({
      next: (res: any) => {
        console.log(res);
        this.reset();
        this.fetchProductList();
        this.toastr.success('Product added successfully');

        this.isLoading = false;
      },
      error: (err: any) => {
        console.log('ERROR:', err.error);
        this.isLoading = false;
      }
    });
  }

  reset() {
    this.service.productsModel.ProductName = '';
    this.service.productsModel.Description = '';
    this.service.productsModel.Price = 0;
    this.service.productsModel.StockQuantity = 0;
    this.service.productsModel.CategoryId = 0;
    this.service.productsModel.ProductImage = '';
    this.service.productsModel.ProductImages = [];
  }


  //get Product By Id
getProductId(ID: number) {
  this.isLoading = true;

  this.service.getProductById(ID).subscribe({
    next: (res: any) => {

      // 1. form model fill
      this.service.productsModel = {
        ProductName: res.productName,
        Description: res.description,
        Price: res.price,
        StockQuantity: res.stockQuantity,
        CategoryId: res.categoryId,
        ProductImage: res.productImage, // यहाँ productImage राख्दा ठिक हुन्छ
        ProductImages: []
      };

      // 2. image preview set (IMPORTANT)
      // यहाँ productImageBase64 को सट्टा productImageUrl राख्नुहोस्
      this.imagePreview = res.productImageUrl; 

      // 3. reset file input (IMPORTANT)
      this.selectedFile = null;

      // 4. select2 category fix
      setTimeout(() => {
        $('#product-category')
          .val(res.categoryId)
          .trigger('change');
      }, 0);

      this.isLoading = false;
    },

    error: () => {
      this.isLoading = false;
    }
  });
}


}
