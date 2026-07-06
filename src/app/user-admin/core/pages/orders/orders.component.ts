import { AfterViewInit, Component, ElementRef, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { OrdersService } from './orders.service';

@Component({
  selector: 'app-orders',
  imports: [],
  templateUrl: './orders.component.html'
})
export class OrdersComponent implements OnInit, AfterViewInit {
  orderList: any[] = [];
  isLoading: boolean = false;

  constructor(
    public service: OrdersService,
    private toastr: ToastrService,
    private el: ElementRef
  ) { }

  ngOnInit(): void { }
  ngAfterViewInit(): void { }

  // Fetch Product List
  fetchMyOrders() {
    this.isLoading = true;
    this.service.getMyorders().subscribe({
      next: (res: any) => {
        this.orderList = res;
        console.log(this.orderList);
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error(err);
        this.isLoading = false;
      }
    });
  }

}
