import { Component } from '@angular/core';
import { HeaderComponent } from '../../header/header.component';
import { FooterComponent } from '../../footer/footer.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-blogs',
  imports: [HeaderComponent, FooterComponent, RouterModule],
  templateUrl: './blogs.component.html',
})
export class BlogsComponent {}
