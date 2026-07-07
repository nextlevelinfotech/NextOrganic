import { AfterViewInit, Component, ElementRef, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { OrdersService } from './orders.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-orders',
  imports: [CommonModule, FormsModule],
  templateUrl: './orders.component.html'
})
export class OrdersComponent implements OnInit, AfterViewInit {
  orderList: any[] = [];
  isLoading: boolean = false;

  showPopup: boolean = false;
  showPopupStatus: boolean = false;
  productList: any[] = [];
  selectedItem: any;
  selectedStatus: string = ''; // ३. छानिएको स्टेटस राख्न यसलाई प्रयोग गर्ने


  constructor(
    public service: OrdersService,
    private toastr: ToastrService,
    private el: ElementRef
  ) { }

  ngOnInit(): void {
    this.fetchMyOrders();
  }
  ngAfterViewInit(): void { }


  viewOrderDetails(ID: number) {
    this.isLoading = true;
    this.service.getProductListById(ID).subscribe({
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
  openPopup(ID: number) {
    this.showPopup = true;
    this.viewOrderDetails(ID);
  }

  closePopup() {
    this.showPopup = false;
  }

  // Fetch Product List
  fetchMyOrders() {
    this.isLoading = true;
    this.service.getMyorders().subscribe({
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

}
