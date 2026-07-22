import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

import { loginService } from '../../auth/login/login.service';
import { AuthService } from '../../../../shared-services/authService/auth.service';

@Component({
  selector: 'app-profile',
  imports: [
    CommonModule,
    RouterModule,
    NgbTooltipModule
  ],
  templateUrl: './profile.component.html'
})
export class ProfileComponent implements AfterViewInit, OnInit {
  isLogin: boolean = false;
  customerId: number | null = null;
  userData: any;
  constructor(
    private authService: AuthService,
    private loginService: loginService,
  ) {
    this.isLogin = this.authService.isLoggedIn();
  }


  ngOnInit(): void {
    this.customerId = this.authService.getCustomerId();

    if (this.customerId !== null) {
      this.getCustomerNameById(this.customerId);
    }
  }

  ngAfterViewInit(): void {


  }

  getCustomerNameById(customerId: number | null) {

    if (!customerId) return;

    this.loginService.getCustomerbyId(customerId).subscribe({
      next: (res: any) => {
        this.userData = res;
        console.log('User Data:', this.userData);
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

}
