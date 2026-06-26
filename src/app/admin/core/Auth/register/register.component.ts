import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { RegisterService } from './register.service';

import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';


@Component({
  selector: 'app-register',
   imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
   styleUrls: ['./register.component.css'] 
})
export class RegisterComponent {
registerForm!: FormGroup;
isEditMode = false;
userList: any[] = []; 
submitButton = 'Save';
resetButton = 'Reset';
constructor(
  private fb: FormBuilder,
  private toastr: ToastrService,
  private registerService: RegisterService 
) {}




submit() {

  const form = this.registerForm.value; 

   if (!form.fullName || form.fullName.trim() === '') {
    this.toastr.error('FullName is required');
    return;
  }
  
  if (!form.username || form.username.trim() === '') {
    this.toastr.error('Username is required');
    return;
  }

  if (!form.email || form.email.trim() === '') {
    this.toastr.error('Email is required');
    return;
  }

  
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(form.email)) {
    this.toastr.error('Invalid email format');
    return;
  }

 
  if (!form.phone || form.phone.trim() === '') {
    this.toastr.error('Phone number is required');
    return;
  }

  if (form.phone.length < 10) {
    this.toastr.error('Phone must be at least 10 digits');
    return;
  }


  if (!form.role || form.role.trim() === '') {
    this.toastr.error('Role is required');
    return;
  }

  if (!form.password || form.password.trim() === '') {
    this.toastr.error('Password is required');
    return;
  }

  if (form.password.length < 6) {
    this.toastr.error('Password must be at least 6 characters');
    return;
  }

  
  this.registerService.registerUser(form).subscribe({

    next: (res: any) => {
      this.toastr.success('User registered successfully');

      this.Reset();
    },

    error: (err) => {
      this.toastr.error('Registration failed');
      console.error(err);
    }

  });
}

ngOnInit() {
 this.registerForm = this.fb.group({
  fullName: ['', Validators.required],
  username: ['', Validators.required],
  email: ['', [Validators.required, Validators.email]],
  phone: ['', [Validators.required, Validators.minLength(10)]], 
  role: ['', Validators.required],
  password: ['', [Validators.required, Validators.minLength(6)]]
});
}

Reset() {
  this.registerForm.reset();

}




//validation

getLabel(field: string): string {
  const map: any = {
    fullName: 'Full Name',
    username: 'Username',
    email: 'Email',
    phone: 'Phone',
    role: 'Role',
    password: 'Password'
  };

  return map[field] || field;
}

handleEnter(event: any, form: FormGroup) {
  const current = event.target as HTMLInputElement;
  const controlName = current.getAttribute('formControlName');

  if (!controlName) return;

  const control = form.get(controlName);

  if (control?.invalid) {

    if (control.errors?.['required']) {
      this.toastr.error(`${this.getLabel(controlName)} is required`);
    }
    else if (controlName === 'email' && control.errors?.['email']) {
      this.toastr.error('Invalid email format');
    }
    else if (controlName === 'phone' && control.errors?.['minlength']) {
      this.toastr.error('Phone must be at least 10 digits');
    }
    else if (controlName === 'password' && control.errors?.['minlength']) {
      this.toastr.error('Password must be at least 6 characters');
    }

    control.markAsTouched();
    current.focus();
    event.preventDefault();
    return;
  }

  // ✅ ONLY inputs inside current form
  const formElement = current.closest('form');

  const inputs = Array.from(
    formElement?.querySelectorAll('[formControlName]') || []
  ) as HTMLElement[];

  const index = inputs.indexOf(current);

  if (index > -1 && index < inputs.length - 1) {
    event.preventDefault();
    inputs[index + 1].focus();
  } else {
    this.submit();
  }
}


}