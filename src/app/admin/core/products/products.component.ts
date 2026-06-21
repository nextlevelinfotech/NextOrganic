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

  imagePreview: string | ArrayBuffer | null = null;

  onFileSelected(event: any): void {
    const file = event.target.files[0];

    if (file) {
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


  // create Product
  postProduct() {

    let payload = {
      ProductName: this.service.productsModel.ProductName,
      Description: this.service.productsModel.Description,
      Price: this.service.productsModel.Price,
      StockQuantity: this.service.productsModel.StockQuantity,
      CategoryId: Number($("#product-category").val()),
      ProductImage: this.imagePreview,
      ProductImages: []
    };

    this.isLoading = true;
    this.service.postProduct(payload).subscribe({
      next: (res: any) => {
        console.log(res, 'data');
        this.isLoading = false;
        this.fetchProductList();
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
