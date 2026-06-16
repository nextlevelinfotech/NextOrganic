import { Component, EventEmitter, Output } from '@angular/core';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { AuthService } from '../../../../Auth/authService/auth.service';

@Component({
  selector: 'app-page-header',
  standalone: true,
  imports: [NgbDropdownModule],
  templateUrl: './page-header.component.html',
})
export class PageHeaderComponent {
  @Output() menuToggle = new EventEmitter<void>();

  constructor(private router: Router, private auth: AuthService) {}

  onHamburgerClick() {
    this.menuToggle.emit();
  }
  logout() {
    this.auth.logout();
  }
}
