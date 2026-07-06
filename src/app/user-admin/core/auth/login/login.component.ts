import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { loginService } from './login.service';
import { AuthService } from '../authService/auth.service';
import { EncryptionService } from '../encryptionservice/encryption.service';
declare var $: any;
@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
})
export class LoginComponent implements AfterViewInit {
  isLoginLoading: boolean = false
  selectedUserId!: number;
  constructor(
    private toastr: ToastrService,
    private router: Router,
    private encrypt: EncryptionService,
    public service: loginService,
    private el: ElementRef,
    private authService: AuthService,
  ) { }
  ngAfterViewInit(): void { }



  // if (
  //   this.payload.userName == 'admin' &&
  //   this.payload.password == 'password'
  // ) {
  //   localStorage.setItem('token', 'true'); // ✅ same key everywhere
  //   this.router.navigate(['/home']);
  //   console.log('Login Success');
  // } else {
  //   console.log('Invalid Credentials');
  // }



  // ---------------- LOGIN ----------------
  loginSubmit() {
    this.isLoginLoading = true;
    const userName = this.service.loginModel.username;
    const password = this.service.loginModel.password;

    if (!userName) {
      this.toastr.error('Username Required');
      this.isLoginLoading = false;
      return;
    }

    if (!password) {
      this.toastr.error('Password Required');
      this.isLoginLoading = false;

      return;
    }

    // JSON Body
    const payload = {
      userId: 0,
      username: this.service.loginModel.username,
      password: this.service.loginModel.password,
      role: this.service.loginModel.role,

    };

    console.log(payload);

    this.service.loginUser(payload).subscribe({


      next: (response: any) => {

        // Customer बाहेक अरूलाई login नदिने
        if (response.role?.toLowerCase() !== 'customer') {
          this.toastr.error('Only Customer can login.');
          this.isLoginLoading = false;
          return;
        }
        
    
        this.authService.setToken(response?.token);
        this.authService.setUserId(response.userId);
        this.toastr.success('Login successful');
        this.router.navigate(['/home']);
      },



      error: (err: any) => {
        if (err.status === 401 || err.status === 400) {
          this.toastr.error('Invalid username or password');
        } else {
          this.toastr.error('Server error');
        }
        this.isLoginLoading = false;
      },
      complete: () => {
        this.isLoginLoading = false; // ✅ unlock button after response
      },
    });
  }




}
