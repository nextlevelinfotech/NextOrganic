import {
  AfterViewInit,
  Component,
  EventEmitter,
  Output,
  ViewChild,
} from '@angular/core';
import { PageHeaderComponent } from '../page-header/page-header.component';
import { PageFooterComponent } from '../page-footer/page-footer.component';
import { PageSidebarComponent } from '../page-sidebar/page-sidebar.component';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { RouterModule } from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatDrawer } from '@angular/material/sidenav';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    PageHeaderComponent,
    PageFooterComponent,
    PageSidebarComponent,
    MatSidenavModule,
  ],
  templateUrl: './layout.component.html',
})
export class LayoutComponent implements AfterViewInit {
  ngAfterViewInit() {
    // Optional: you can do initialization here if needed
  }
  isSidebarCollapsed = true;
  isToggle:boolean = false; 

  toggleMenu() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

    togglesub() {
    this.isToggle = !this.isToggle;
  }
}
