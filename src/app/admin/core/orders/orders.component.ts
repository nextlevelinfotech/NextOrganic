import { AfterViewInit, Component, ElementRef, OnInit } from '@angular/core';
import { OrdersService } from './orders.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-orders',
  imports: [CommonModule],
  templateUrl: './orders.component.html'
})
export class OrdersComponent implements OnInit, AfterViewInit {
  showPopup: boolean = false;
  orderList: any[] = [];
  productList: any[] = [];
  isLoading: boolean = false;

  // --- UI Interactions ---

  openPopup(ID: number) {
    this.showPopup = true;
    this.viewOrderDetails(ID);
  }
  closePopup() {
    this.showPopup = false;
  }
  

  constructor(
    public service: OrdersService,
    private toastr: ToastrService,
    private el: ElementRef
  ) { }

  ngAfterViewInit(): void {

  }

  ngOnInit(): void {
    this.fetchAllOrders();
    // this.fetchProductList();
  }

  fetchAllOrders() {
    this.isLoading = true;

    this.service.getAllOrders().subscribe({
      next: (res: any) => {
        this.orderList = res;
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error(err);
        this.isLoading = false;
      }
    });
  }


  // viewOrderDetails
  viewOrderDetails(ID: number) {
    this.isLoading = true;
    this.service.getProductList(ID).subscribe({
      next: (res: any) => {
        this.productList = res;
        console.log(this.productList);

        this.isLoading = false;
      },
      error: (err: any) => {
        console.error(err);
        this.isLoading = false;
      }
    });
  }


}
