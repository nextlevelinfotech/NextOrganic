import { AfterViewInit, Component, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { AdminloginService } from './adminlogin.service';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  FormsModule,
} from '@angular/forms';

declare var $: any;
import 'select2';
import { EncryptionService } from '../../../encryptionservice/encryption.service';
import { AuthService } from '../../../authService/auth.service';

@Component({
  selector: 'app-adminlogin',
  standalone: true,
  imports: [CommonModule, HttpClientModule, ReactiveFormsModule, FormsModule],
  templateUrl: './adminlogin.component.html',
})
export class AdminloginComponent implements AfterViewInit {
  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private router: Router,
    private encrypt: EncryptionService,
    public service: AdminloginService,
    private el: ElementRef,
    private authService: AuthService,
  ) {}

  showPopup: boolean = false;
  showChangePswPopup: boolean = false;
  isLoading: boolean = false;
  isLoginLoading: boolean = false;

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

  loginForm: FormGroup = new FormGroup({});

  ngOnInit() {
    this.loginForm = this.fb.group({
      userId: [0],
      username: ['', Validators.required],
      password: ['', Validators.required],
      role: ['string'],
    });
  }

  // ---------------- LOGIN ----------------
  loginsubmit() {
    this.isLoginLoading = true;
    const userName = this.loginForm.value.username;
    const password = this.loginForm.value.password;

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
      username: userName,
      password: password,
      role: 'string',
    };

    console.log(payload);

    this.service.loginUser(payload).subscribe({
      next: (response: any) => {
        if (response?.token) {
          this.isLoginLoading = false;

          this.authService.setToken(response?.token); // store token

          // console.log('Stored token:', localStorage.getItem('token'));
          // console.log('Decrypted token:', this.authService.gettoken());
          this.toastr.success('Login successful');
          this.router.navigate(['/dashboard']);

          this.loginForm.value.username = '';
          this.loginForm.value.password = '';
        } else {
          this.toastr.error('Invalid login');
        }
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

  // Password Toggle
  isPasswordVisible = false;

  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  ngAfterViewInit(): void {
    $('#companyCode').on('change keyup', (event: any) => {
      const upperVal = event.target.value.toUpperCase();
      $(event.target).val(upperVal);
    });
  }

  clicked = false;

  onClickBtn() {
    this.clicked = true;
    setTimeout(() => (this.clicked = false), 300);
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
  // input enter  ***********************
  event(e: any, recinput: any, nextinput: any) {
    if (e.key === 'Enter') {
      if (
        (recinput.id === 'companyCode' && recinput.value === '') ||
        recinput.value === undefined
      ) {
        recinput.focus();
        this.toastr.error('Code Required!');
      }

      if (
        (recinput.id === 'userName' && recinput.value === '') ||
        recinput.value === undefined
      ) {
        recinput.focus();
        this.toastr.error('Username Required!');
      } else if (
        (recinput.id === 'password' && recinput.value === '') ||
        recinput.value === undefined
      ) {
        recinput.focus();
        this.toastr.error('Password Required!');
      } else {
        nextinput.focus();
      }
    }
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
