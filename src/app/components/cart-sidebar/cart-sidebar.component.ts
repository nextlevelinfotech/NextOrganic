import { AfterViewInit, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
declare var jQuery: any;
@Component({
  selector: 'app-cart-sidebar',
  imports: [RouterModule],
  templateUrl: './cart-sidebar.component.html',
})
export class CartSidebarComponent implements AfterViewInit {
  ngAfterViewInit(): void {
    this.cartSidebar();
  }

  cartSidebar() {
    $('.cart-close-btn, .body-overlay').on('click', function () {
      $('.cart-sidebar').removeClass('active');
      $('.body-overlay').removeClass('active');
    });

    $('.cart-btn').on('click', function () {
      $('.cart-sidebar').addClass('active');
      $('.body-overlay').addClass('active');
    });
  }
}
