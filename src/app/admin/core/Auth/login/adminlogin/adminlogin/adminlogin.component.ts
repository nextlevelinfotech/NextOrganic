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
  ) { }

  showPopup: boolean = false;
  showChangePswPopup: boolean = false;

  showRegisterPopup: boolean = false;

  isLoading: boolean = false;
  isLoginLoading: boolean = false;

  isRegisterLoading: boolean = false

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

  //Reister popup
  openRegisterPopup() {
    this.showRegisterPopup = true;
  }

  closeRegisterPopup() {
    this.showRegisterPopup = false;
    this.resetRegister();
  }

  //Reister popup end

  loginForm: FormGroup = new FormGroup({});

  ngOnInit() {
    this.loginForm = this.fb.group({
      userId: [0],
      username: ['', Validators.required],
      password: ['', Validators.required],
      role: [' '],
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
      role: 'Admin',

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
          this.router.navigate(['/products']);

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

  // ---------------- Register ----------------

  validateRegisterForm(): boolean {

    if (!this.service.registerModel.username?.trim()) {
      this.toastr.error('Username is required');
      return false;
    }

    if (!this.service.registerModel.password?.trim()) {
      this.toastr.error('Password is required');
      return false;
    }

    if (!this.service.registerModel.email?.trim()) {
      this.toastr.error('Email is required');
      return false;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(this.service.registerModel.email)) {
      this.toastr.error('Invalid email address');
      return false;
    }

    if (!this.service.registerModel.fullName?.trim()) {
      this.toastr.error('Full Name is required');
      return false;
    }

    if (!this.service.registerModel.phone) {
      this.toastr.error('Phone number is required');
      return false;
    }
    const phonePattern = /^[0-9]{10}$/;

    if (!phonePattern.test(this.service.registerModel.phone)) {
      this.toastr.error('Phone number must be 10 digits');
      return false;
    }


    if (!this.service.registerModel.role?.trim()) {
      this.toastr.error('Please select role');
      return false;
    }

    return true;
  }

  postRegister() {
    if (!this.validateRegisterForm()) {
      return;
    }

    this.isRegisterLoading = true;
    let payload = {
      username: this.service.registerModel.username,
      password: this.service.registerModel.password,
      email: this.service.registerModel.email,
      fullName: this.service.registerModel.fullName,
      phone: this.service.registerModel.phone,
      role: this.service.registerModel.role,
    };

    this.service.postRegister(payload).subscribe({
      next: (res: any) => {
        this.toastr.success('User registered successfully');
        this.resetRegister();
        this.closeRegisterPopup()
        this.isRegisterLoading = false;
      },
      error: (err: any) => {
        console.error(err);
        this.isRegisterLoading = false;
      }
    });
  }

  resetRegister() {
    this.service.registerModel.username = '';
    this.service.registerModel.password = '';
    this.service.registerModel.email = '';
    this.service.registerModel.fullName = '';
    this.service.registerModel.phone = '';
    this.service.registerModel.role = '';
  }



}
