import { Component } from '@angular/core';
import { HeaderComponent } from '../../header/header.component';
import { FooterComponent } from '../../footer/footer.component';

@Component({
  selector: 'app-error-page',
  templateUrl: './error-page.component.html',
  imports: [HeaderComponent, FooterComponent],
})
export class ErrorPageComponent {}
