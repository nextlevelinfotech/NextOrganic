import { CommonModule } from '@angular/common';
import { AfterViewInit, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
declare var $: any;
@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
})
export class LoginComponent implements AfterViewInit {
  constructor(private router: Router) {}
  ngAfterViewInit(): void {}

  payload: any = {
    userName: '',
    password: '',
  };

loginSubmit() {
  if (
    this.payload.userName == 'admin' &&
    this.payload.password == 'password'
  ) {
    localStorage.setItem('token', 'true'); // ✅ same key everywhere
    this.router.navigate(['/home']);
    console.log('Login Success');
  } else {
    console.log('Invalid Credentials');
  }
}
}
