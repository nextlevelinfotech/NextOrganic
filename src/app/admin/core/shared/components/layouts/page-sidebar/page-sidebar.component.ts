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

  constructor(private router: Router) {}

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
    {
      menuId: 1,
      menuName: 'Dashboard',
      Menuicon: 'fa-solid fa-home',
      path: '',
      shortCutKey: '',
      formName: 'Authorization',
      extra1: 'HMS',
      children: [
        {
          menuId: 12,
          menuName: 'Menu Creation',
          Menuicon: 'fa-solid fa-rectangle-list',
          path: '/auth/menusetup',
          shortCutKey: '',
          formName: 'Menu Management',
          extra1: '',
          children: [
            {
              menuId: 14,
              menuName: 'test 1',
              Menuicon: 'fa-solid fa-user-plus',
              path: '',
              shortCutKey: '',
              formName: 'Authorization',
              extra1: 'HMS',
              children: [
                {
                  menuId: 14,
                  menuName: 'dashboard',
                  Menuicon: 'fa-solid fa-user-plus',
                  path: '/dashboard',
                  shortCutKey: '',
                  formName: 'Authorization',
                  extra1: 'HMS',
                },
                {
                  menuId: 18,
                  menuName: 'company-details',
                  Menuicon: 'fa-solid fa-user-plus',
                  path: 'organization/company-details',
                  shortCutKey: '',
                  formName: 'Authorization',
                  extra1: 'HMS',
                },
              ],
            },
            {
              menuId: 15,
              menuName: 'test 2',
              Menuicon: 'fa-solid fa-user-plus',
              path: '',
              shortCutKey: '',
              formName: 'Authorization',
              extra1: 'HMS',
            },
          ],
        },
     
      ],
    },
   
  ];
}
