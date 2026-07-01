import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HeaderComponent } from '../../../header/header.component';
import { FooterComponent } from '../../../footer/footer.component';

@Component({
  selector: 'app-confirmation',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, RouterModule],
  templateUrl: './confirmation.component.html'
})
export class ConfirmationComponent implements OnInit {

  orderId: string = '';
  orderNo: string = '';
  deliveryCharge: number = 0;
  orderStatus: string = '';
  orderDate: string = '';
  totalAmount: number = 0;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {

    this.route.queryParams.subscribe(params => {
      this.orderId = params['orderId'];
      this.orderNo = params['orderNo'];
      this.orderStatus = params['orderStatus'];
      this.deliveryCharge = params['deliveryCharge'];
      this.totalAmount = params['totalAmount'];
    });

  }

}