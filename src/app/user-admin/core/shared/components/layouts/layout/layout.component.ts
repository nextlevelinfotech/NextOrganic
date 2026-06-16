import {
  AfterViewInit,
  Component,
  EventEmitter,
  Output,
  ViewChild,
} from '@angular/core';

import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { RouterModule } from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatDrawer } from '@angular/material/sidenav';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../../../../../header/header.component';
import { FooterComponent } from '../../../../../../footer/footer.component';
@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatSidenavModule,
    HeaderComponent,
    FooterComponent,
  ],
  templateUrl: './layout.component.html',
})
export class LayoutComponent implements AfterViewInit {
  ngAfterViewInit() {
    // Optional: you can do initialization here if needed
  }
  isSidebarCollapsed = true;
  isToggle: boolean = false;

  toggleMenu() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  togglesub() {
    this.isToggle = !this.isToggle;
  }
}
