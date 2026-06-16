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
        {
          menuId: 14,
          menuName: 'Permission Setup',
          Menuicon: 'fa-solid fa-unlock-keyhole',
          path: '/auth/permissionsetup',
          shortCutKey: '',
          formName: 'Permission Setup',
          extra1: '',
        },
        {
          menuId: 15,
          menuName: 'Role Setup',
          Menuicon: 'fa-solid fa-unlock',
          path: '/auth/rolesetup',
          shortCutKey: '',
          formName: 'Role Setup',
          extra1: '',
        },
        {
          menuId: 19,
          menuName: 'User Setup',
          Menuicon: 'fa-solid fa-user-plus',
          path: '/auth/usersetup',
          shortCutKey: '',
          formName: 'User Setup',
          extra1: '',
        },
        {
          menuId: 20,
          menuName: 'Privilege',
          Menuicon: 'fa-solid fa-check-to-slot',
          path: '/auth/menurole',
          shortCutKey: '',
          formName: 'Privilege',
          extra1: 'HMS',
        },
        {
          menuId: 21,
          menuName: 'Company Setup',
          Menuicon: 'fa-solid fa-people-group',
          path: '/mastersetup/companysetup/index',
          shortCutKey: '',
          formName: 'Company Setup',
          extra1: '',
        },
        {
          menuId: 22,
          menuName: 'Doctor Register',
          Menuicon: 'fa-solid fa-user-doctor',
          path: '/mastersetup/doctorsetup',
          shortCutKey: '',
          formName: 'Doctor Register',
          extra1: '',
        },
        {
          menuId: 24,
          menuName: 'Counter Salesman Assign',
          Menuicon: '',
          path: '/countersalesman',
          shortCutKey: 'Khata',
          formName: 'Counter Salesman Assign',
          extra1: 'Khata',
        },
        {
          menuId: 25,
          menuName: 'SQL Analyzer',
          Menuicon: '',
          path: '/sqlanalyzer',
          shortCutKey: 'Khata',
          formName: 'SQL Analyzer',
          extra1: 'Khata',
        },
      ],
    },
    {
      menuId: 2,
      menuName: 'Master Setup',
      Menuicon: 'fa-solid fa-wrench',
      path: '',
      shortCutKey: '',
      formName: 'Master Setup',
      extra1: '',
      children: [
        {
          menuId: 26,
          menuName: 'Fiscal Year Setup',
          Menuicon: 'fa-solid fa-calendar-days',
          path: 'fiscalyear/index',
          shortCutKey: 'Khata',
          formName: 'Fiscal Year Setup',
          extra1: 'Khata',
        },
        {
          menuId: 27,
          menuName: 'PrefixSuffix',
          Menuicon: 'fa-solid fa-font',
          path: 'prifix/index',
          shortCutKey: 'Khata',
          formName: 'PrefixSuffix',
          extra1: 'Khata',
        },
        {
          menuId: 28,
          menuName: 'Tax Charge',
          Menuicon: 'fa-solid fa-comments-dollar',
          path: 'tax/index',
          shortCutKey: 'Khata',
          formName: 'Tax Charge',
          extra1: 'Khata',
        },
        {
          menuId: 29,
          menuName: 'Cost Category Setup',
          Menuicon: 'fa-solid fa-money-check-dollar',
          path: '/mastersetup/costcategory/index',
          shortCutKey: '',
          formName: 'Cost Category Setup',
          extra1: '',
        },
        {
          menuId: 30,
          menuName: 'Department Setup',
          Menuicon: 'fa-solid fa-building',
          path: '/mastersetup/department/index',
          shortCutKey: 'Ctrl+8',
          formName: 'Department Setup',
          extra1: '',
        },
      ],
    },
    {
      menuId: 3,
      menuName: 'Account',
      Menuicon: 'fa-solid fa-sack-dollar',
      path: '',
      shortCutKey: '',
      formName: 'Account',
      extra1: '',
    },
    {
      menuId: 4,
      menuName: 'Counter',
      Menuicon: 'fa-solid fa-cash-register',
      path: '',
      shortCutKey: '',
      formName: 'Counter',
      extra1: '',
    },
    {
      menuId: 5,
      menuName: 'Inventory',
      Menuicon: 'fa-solid fa-warehouse',
      path: '',
      shortCutKey: '',
      formName: 'Inventory',
      extra1: '',
    },
    {
      menuId: 6,
      menuName: 'Laboratory',
      Menuicon: 'fa-sharp fa-solid fa-flask',
      path: '',
      shortCutKey: 'NULL',
      formName: 'Laboratory',
      extra1: '',
    },
    {
      menuId: 7,
      menuName: 'Radiology',
      Menuicon: 'fa-solid fa-x-ray',
      path: '',
      shortCutKey: 'NULL',
      formName: 'Radiology',
      extra1: '',
    },
    {
      menuId: 8,
      menuName: 'EMR',
      Menuicon: 'fa-solid fa-clipboard',
      path: '',
      shortCutKey: 'NULL',
      formName: 'EMR',
      extra1: '',
    },
  ];
}
