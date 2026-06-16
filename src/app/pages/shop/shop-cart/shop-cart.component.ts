import { Component } from '@angular/core';
import { HeaderComponent } from '../../../header/header.component';
import { FooterComponent } from '../../../footer/footer.component';

@Component({
  selector: 'app-shop-cart',
  imports: [HeaderComponent, FooterComponent],
  templateUrl: './shop-cart.component.html',
})
export class ShopCartComponent {}
