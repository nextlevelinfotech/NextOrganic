import { Component } from '@angular/core';
import { HeaderComponent } from '../../../../../header/header.component';
import { FooterComponent } from '../../../../../footer/footer.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-user-layout',
  imports: [HeaderComponent, FooterComponent, CommonModule, RouterModule],
  templateUrl: './user-layout.component.html',
})
export class UserLayoutComponent {}
