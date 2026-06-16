import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, HostListener } from '@angular/core';
declare var jQuery: any;
import * as jquery from 'jquery';
import { RouterModule } from '@angular/router';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { CartSidebarComponent } from '../components/cart-sidebar/cart-sidebar.component';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../user-admin/core/auth/authService/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NgbTooltipModule,
    CartSidebarComponent,
    NgbDropdownModule,
  ],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements AfterViewInit {
  isLogin: boolean = false;

  constructor(private authService: AuthService) {
    this.isLogin = this.authService.isLoggedIn();
  }

  ngAfterViewInit(): void {
    this.initMobileMenu();
  }

  private initMobileMenu(): void {
    (function ($) {
      $.fn.thmobilemenu = function (opts: HTMLElement) {
        const settings = $.extend(
          {
            toggleBtn: '.th-menu-toggle',
            bodyClass: 'th-body-visible',
            submenuClass: 'th-submenu',
            parentClass: 'th-item-has-children',
            activeClass: 'th-active',
            expandIcon: '<span class="th-mean-expand"></span>',
            openClass: 'th-open',
            speed: 300,
          },
          opts,
        );

        return this.each(function (this: HTMLElement) {
          const $menu = $(this);

          // Mark submenus
          $menu.find('li:has(ul)').each(function (this: HTMLElement) {
            const $li = $(this);
            $li.addClass(settings.parentClass);
            $li.children('ul').addClass(settings.submenuClass).hide();
            $li.children('a').append(settings.expandIcon);
          });

          // Toggle submenu
          $menu.on(
            'click',
            `.${settings.parentClass} > a`,
            function (this: HTMLElement, e: JQuery.ClickEvent) {
              e.preventDefault();
              const $li = $(this).closest('li');
              $li.toggleClass(settings.activeClass);
              $li
                .children('ul')
                .slideToggle(settings.speed)
                .toggleClass(settings.openClass);
            },
          );

          // Toggle menu visibility
          $(settings.toggleBtn).on('click', (e: JQuery.ClickEvent) => {
            e.stopPropagation();
            $menu.toggleClass(settings.bodyClass);
          });

          //close menu on link click
          $menu.on(
            'click',
            '.th-submenu a, li:not(.th-item-has-children) > a',
            function () {
              $menu.removeClass(settings.bodyClass);

              $menu
                .find(`.${settings.submenuClass}`)
                .slideUp(settings.speed)
                .removeClass(settings.openClass);

              $menu
                .find(`.${settings.parentClass}`)
                .removeClass(settings.activeClass);
            },
          );

          // Close on outside click
          $(document).on('click', () => {
            $menu.removeClass(settings.bodyClass);
            $menu
              .find(`.${settings.submenuClass}`)
              .slideUp(settings.speed)
              .removeClass(settings.openClass);
            $menu
              .find(`.${settings.parentClass}`)
              .removeClass(settings.activeClass);
          });

          $menu.on('click', '.th-menu-area', (e: JQuery.ClickEvent) =>
            e.stopPropagation(),
          );
        });
      };

      // Initialize the plugin on menu
      $('.th-menu-wrapper').thmobilemenu();
    })(jQuery); // 👈 pass jQuery into the IIFE
  }
  isSticky: boolean = false;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const scrollTop =
      window.pageYOffset ||
      document.documentElement.scrollTop ||
      document.body.scrollTop ||
      0;
    this.isSticky = scrollTop > 200;
  }

  Menulist: any[] = [
    {
      menuId: 1,
      menuName: 'shop',
      path: '',
      children: [
        {
          menuId: 12,
          menuName: 'Shop Categories',
          path: '/shop/categories',
          children: [
            {
              menuId: 14,
              menuName: 'test 1',
              path: '',
            },
            {
              menuId: 15,
              menuName: 'test 2',
              path: '',
            },
          ],
        },
      ],
    },
  ];

  //logout

  logout() {
    this.authService.logout();
    this.isLogin = false;
  }
}
