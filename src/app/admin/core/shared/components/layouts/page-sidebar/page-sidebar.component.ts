import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { signal } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
declare var $: any;
@Component({
  selector: 'app-page-sidebar',
  standalone: true,
  imports: [RouterLink, CommonModule, MatExpansionModule, NgbDropdownModule],
  templateUrl: './page-sidebar.component.html',
})
export class PageSidebarComponent implements AfterViewInit {
  @Input() isSidebarCollapsed: boolean = false;
  @Input() isToggle: boolean = false;

  panelOpenState = signal(false);

  @Output() menuToggle = new EventEmitter<void>();

  constructor(private router: Router) { }

  onHamburgerClick() {
    this.menuToggle.emit();
  }

  ngAfterViewInit(): void {
    this.collapseSidebar();
  }

  closeMenu() {
    this.isSidebarCollapsed = true;
  }

  collapseSidebar() {
    const component: any = this;

    $('.mat-expansion-panel ').on('click', function () {

      setTimeout(() => {
        if ($('.layout-sidenav').hasClass('collapsed')) {
          component.onHamburgerClick();

          console.log('collapsed aayo');
        } else {
        }
      });
    });
  }



  handleSubMenuClick(formName: any, menuName: any) {
    formName && menuName
      ? localStorage.setItem(
        'pageHeadTab',
        JSON.stringify({
          formName: formName,
          menuName: menuName,
        }),
      )
      : null;
  }


  Menulist: any[] = [
    // {
    //   menuId: 1,
    //   menuName: 'Profile',
    //   Menuicon: 'ri-shopping-bag-3-line',
    //   path: '/profile',
    //   shortCutKey: '',
    //   formName: 'Product',
    //   extra1: 'HMS',

    // },
    {
      menuId: 2,
      menuName: 'Products',
      Menuicon: 'ri-shopping-bag-3-line',
      path: '/products',
      shortCutKey: '',
      formName: 'Product',
      extra1: 'HMS',

    },
    {
      menuId: 3,
      menuName: 'Category',
      Menuicon: 'ri-price-tag-3-line',
      path: '/category',
      shortCutKey: '',
      formName: 'Category',
      extra1: 'HMS',
    },

    {
      menuId: 4,
      menuName: 'Orders',
      Menuicon: 'ri-price-tag-3-line',
      path: '/admin-orders',
      shortCutKey: '',
      formName: 'Category',
      extra1: 'HMS',
    }
  ];
}
