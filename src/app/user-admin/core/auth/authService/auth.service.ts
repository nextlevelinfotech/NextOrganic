import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private router: Router) {}
  //  Check login
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  //  Logout
  logout() {
    localStorage.clear();
    this.router.navigate(['/home']);
  }
}
