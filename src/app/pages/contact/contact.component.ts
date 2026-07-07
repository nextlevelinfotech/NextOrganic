import { Component } from '@angular/core';
import { HeaderComponent } from '../../header/header.component';
import { FooterComponent } from '../../footer/footer.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [
    HeaderComponent,
    FooterComponent,
    CommonModule,
    FormsModule
  ],
  templateUrl: './contact.component.html',
})
export class ContactComponent {

  contactModel = {
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    message: ''
  };


  constructor(
    private toastr: ToastrService
  ) { }


  submitContact(form: any) {

    if (form.invalid) {

      if (!this.contactModel.firstName) {
        this.toastr.error('Please enter first name');
        return;
      }

      if (!this.contactModel.lastName) {
        this.toastr.error('Please enter last name');
        return;
      }

      if (!this.contactModel.email) {
        this.toastr.error('Please enter email');
        return;
      }

      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailPattern.test(this.contactModel.email)) {
        this.toastr.error('Please enter a valid email address');
        return;
      }


      if (!this.contactModel.phoneNumber) {
        this.toastr.error('Please enter phone number');
        return;
      }

      const phonePattern = /^[0-9]{10}$/;

      if (!phonePattern.test(this.contactModel.phoneNumber)) {
        this.toastr.error('Please enter a valid 10-digit phone number');
        return;
      }

      if (!this.contactModel.message) {
        this.toastr.error('Please enter message');
        return;
      }

      return;
    }


    // API call यहाँ राख्ने

    this.toastr.success(
      'Message sent successfully'
    );


    form.resetForm();

  }

}