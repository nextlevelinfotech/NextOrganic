import { Component } from '@angular/core';

import { FooterComponent } from '../../../footer/footer.component';
import { HeaderComponent } from '../../../header/header.component';

@Component({
  selector: 'app-wishlist',
  imports: [HeaderComponent, FooterComponent],
  templateUrl: './wishlist.component.html',
})
export class WishlistComponent {}
