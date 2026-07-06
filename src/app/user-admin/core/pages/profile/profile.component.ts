import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../auth/authService/auth.service';
import { loginService } from '../../auth/login/login.service';

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
  userId: number | null = null;
  userData: any;
  constructor(
    private authService: AuthService,
    private loginService: loginService,
  ) {
    this.isLogin = this.authService.isLoggedIn();
  }


  ngOnInit(): void {
    this.userId = this.authService.getUserId();

    if (this.userId !== null) {
      this.getUserNameById(this.userId);
    }
  }

  ngAfterViewInit(): void {


  }

  getUserNameById(userId: number | null) {

    if (!userId) return;

    this.loginService.getuserbyId(userId).subscribe({
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
