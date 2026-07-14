import { Component, EventEmitter, Output } from '@angular/core';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { AuthService } from '../../../../Auth/authService/auth.service';
import { AdminloginService } from '../../../../Auth/login/adminlogin/adminlogin/adminlogin.service';

@Component({
  selector: 'app-page-header',
  standalone: true,
  imports: [NgbDropdownModule],
  templateUrl: './page-header.component.html',
})
export class PageHeaderComponent {
  
  @Output() menuToggle = new EventEmitter<void>();
  userId: number | null = null;
  userData: any;

  constructor(
    private router: Router,
    private authService: AuthService,
    private AdminloginService: AdminloginService,
  ) { }

  ngOnInit(): void {
    this.userId = this.authService.getUserId();

    if (this.userId !== null) {
      this.getUserNameById(this.userId);
    }

  }


  onHamburgerClick() {
    this.menuToggle.emit();
  }
  logout() {
    this.authService.logout();
  }


  getUserNameById(userId: number | null) {

    if (!userId) return;

    this.AdminloginService.getuserbyId(userId).subscribe({
      next: (res: any) => {
        this.userData = res;
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }



}
