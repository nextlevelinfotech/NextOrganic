import { Component, ElementRef } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { RegisterService } from './register.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.component.html'
})
export class RegisterComponent {
  showPopup: boolean = false;
  showChangePswPopup: boolean = false;

  showRegisterPopup: boolean = false;

  isLoading: boolean = false;
  isLoginLoading: boolean = false;

  isRegisterLoading: boolean = false


  constructor(

    private toastr: ToastrService,
    private router: Router,
    public service: RegisterService,
    private el: ElementRef,
  ) { }

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
        // this.router.navigate(['/home']);
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
