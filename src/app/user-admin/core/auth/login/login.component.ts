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

  selectedUserId!: number;


  showPopup: boolean = false;
  showChangePswPopup: boolean = false;

  showRegisterPopup: boolean = false;

  isLoginLoading: boolean = false;
  isLoading: boolean = false;

  openPopup() {
    this.showPopup = true;
  }

  closePopup() {
    this.showPopup = false;
    this.status = null;

    this.model.email = '';
  }

  closeChangePswPopup() {
    this.showChangePswPopup = false;

    this.service.changePswModel.email = '';
    this.service.changePswModel.otp = '';
    this.service.changePswModel.newPassword = '';
  }



  constructor(
    private toastr: ToastrService,
    private router: Router,
    private encrypt: EncryptionService,
    public service: loginService,
    private el: ElementRef,
    private authService: AuthService,
  ) { }


  // Password Toggle
  isPasswordVisible = false;

  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }
  ngAfterViewInit(): void { }


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
        if (response.role !== 'Customer') {
          this.toastr.error('Only Customer can login.');
          this.isLoginLoading = false;
          return;
        }


        this.authService.setToken(response?.token);
        this.authService.setCustomerId(response.userId);
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


  // Forgot password
  status: 'success' | 'error' | 'empty' | null = null;

  model = {
    email: '',
  };

  message: any = '';

  forgotPassword() {
    this.status = null;
    this.isLoading = true;

    if (!this.model.email) {
      this.message = 'Email is required';
      this.status = 'empty';
      this.isLoading = false;
      return;
    }

    this.service.forgotPassword(this.model.email).subscribe({
      next: (response: any) => {
        this.message = response;
        this.status = 'success';
        this.toastr.success('OTP has sent to Email');
        this.showChangePswPopup = true;
        this.isLoading = false;
        this.showPopup = false;
        this.status = null;

        this.model.email = '';
      },
      error: () => {
        this.message = 'Something went wrong';
        this.status = 'error';
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false; // ✅ unlock button after response
      },
    });
  }

  changePassword() {
    this.isLoading = true;

    const payload = {
      email: this.service.changePswModel.email,
      otp: this.service.changePswModel.otp,
      newPassword: this.service.changePswModel.newPassword,
    };

    this.service.changePassword(payload).subscribe({
      next: (response: any) => {
        console.log(response);
        this.toastr.success(response);
        this.showChangePswPopup = false;
        this.isLoading = false;

        this.service.changePswModel.email = '';
        this.service.changePswModel.otp = '';
        this.service.changePswModel.newPassword = '';
      },
      error: () => {
        this.toastr.error('error in password reset');
        this.showChangePswPopup = true;
        this.isLoading = false;
      },

      complete: () => {
        this.isLoading = false; // ✅ unlock button after response
      },
    });
  }


}
