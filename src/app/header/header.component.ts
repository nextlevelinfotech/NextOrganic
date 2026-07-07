import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, HostListener, OnInit, OnDestroy } from '@angular/core';
declare var jQuery: any;
import * as jquery from 'jquery';
import { RouterModule } from '@angular/router';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { CartSidebarComponent } from '../components/cart-sidebar/cart-sidebar.component';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../user-admin/core/auth/authService/auth.service';
import { ShopCommonService } from '../common/service/shop-common.service';
import { CartEventService } from '../common/service/cart-event.service';
import { Subscription } from 'rxjs';
import { loginService } from '../user-admin/core/auth/login/login.service';

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
export class HeaderComponent implements AfterViewInit, OnInit, OnDestroy {
  isLogin: boolean = false;
  cartCount: number = 0;
  userId: number | null = null;
  private cartSubscription!: Subscription;

  userData: any;


  constructor(
    private authService: AuthService,
    private service: ShopCommonService,
    private loginService: loginService,
    private cartEventService: CartEventService
  ) {
    this.isLogin = this.authService.isLoggedIn();
  }

  ngOnInit(): void {
    this.userId = this.authService.getUserId();

    if (this.userId !== null) {
      this.getUserNameById(this.userId);
    }

    if (!this.authService.isLoggedIn()) {
      return;
    }


    this.cartSubscription = this.cartEventService.cartUpdated$.subscribe((updated: any) => {
      // 🌟 सुरक्षा: यदि युजर लगइन छैन भने कार्ट एपीआई कल गर्नै नदिने

      if (updated !== null && updated !== undefined) {
        if (Array.isArray(updated)) {
          // पेमेन्ट पछि [] आउँदा सिधै जिरो बनाउने
          this.calculateCountFromList(updated);
        } else {
          // साधारण ट्रिगर (true) आउँदा मात्र API कल गर्ने
          this.loadCartCount();
        }
      } else {
        // 🌟 पहिलो पटक एप्लिकेसन खुल्दा (null आउँदा) मात्र API कल गर्ने
        this.loadCartCount();
      }
    });
  }
  ngAfterViewInit(): void {
    this.initMobileMenu();
  }


  loadCartCount() {
    this.service.getCartList().subscribe({
      next: (res: any) => {
        const list = res || [];
        this.calculateCountFromList(list);
      },
      error: (err) => {
        console.error('Cart count :', err);
      }
    });
  }

  calculateCountFromList(list: any[]) {
    if (list && list.length > 0) {
      // यदि टोटल सामानको संख्या (Quantity) जोड्ने हो भने:
      this.cartCount = list.reduce((total: number, item: any) => total + (Number(item.quantity) || 1), 0);
    } else {
      this.cartCount = 0;
    }
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
    })(jQuery);
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

  logout() {
    this.authService.logout();
    this.isLogin = false;
  }

  ngOnDestroy(): void {
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
  }


  // // get user info
  // fetchallusers() {
  //   this.loginService.getallusers().subscribe({
  //     next: (res: any) => {
  //       this.userList
  //       console.log(res, 'fetchallusers')
  //     },
  //     error: (err: any) => {
  //       console.log(err)
  //     },
  //     complete: () => {

  //     }
  //   })
  // }


  getUserNameById(userId: number | null) {

    if (!userId) return;

    this.loginService.getuserbyId(userId).subscribe({
      next: (res: any) => {
        this.userData = res;
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }
}