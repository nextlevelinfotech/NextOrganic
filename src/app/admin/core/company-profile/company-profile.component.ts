import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { CompanyProfileService } from './company-profile.service';
declare var $: any;
import 'select2';
declare const setFocusOnNextElement: any;
@Component({
  selector: 'app-company-profile',
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './company-profile.component.html',
  styleUrl: './company-profile.component.css',
})
export class CompanyProfileComponent implements AfterViewInit, OnInit {
  constructor(
    private toastr: ToastrService,
    private router: Router,
    public service: CompanyProfileService,
    private el: ElementRef,
  ) {}
  @ViewChild('companyName') companyName!: ElementRef;

  isLoading: boolean = false;

  ngOnInit(): void {
    this.fetchCompanyList();
  }

  ngAfterViewInit(): void {
    $('#country').focus();

    // $country.select2();

    // $country.on('select2:select', () => {
    //   $('#companyName').focus();
    // });

    $('input, select, textarea, button').on('keydown', function (event: any) {
      if (event.keyCode === 13 && !event.shiftKey) {
        event.preventDefault();

        const el = event.target;
        setFocusOnNextElement.call(el);
      }
    });

    $(this.el.nativeElement).find('select').select2();
    $('select').on('select2:select', function (this: HTMLElement) {
      setTimeout(() => {
        setFocusOnNextElement.call(this);
      }, 0);
    });
  }

  validation() {
    if (
      this.service.companyProfileModel.companyName == '' ||
      this.service.companyProfileModel.companyName === null ||
      this.service.companyProfileModel.companyName === undefined
    ) {
      this.toastr.error('Company Name is required');
      $('#companyName').focus();
      return false;
    } else if (
      this.service.companyProfileModel.address == '' ||
      this.service.companyProfileModel.address === null ||
      this.service.companyProfileModel.address === undefined
    ) {
      this.toastr.error('Address is required');
      return false;
    } else if (
      this.service.companyProfileModel.phoneNumber == '' ||
      this.service.companyProfileModel.phoneNumber === null ||
      this.service.companyProfileModel.phoneNumber === undefined
    ) {
      this.toastr.error('Phone is required');
      return false;
    } else if (
      this.service.companyProfileModel.email == '' ||
      this.service.companyProfileModel.email === null ||
      this.service.companyProfileModel.email === undefined
    ) {
      this.toastr.error('email is required');
      return false;
    } else if (
      this.service.companyProfileModel.vatOrPan == '' ||
      this.service.companyProfileModel.vatOrPan === null ||
      this.service.companyProfileModel.vatOrPan === undefined
    ) {
      this.toastr.error('Vat/pan is required');
      return false;
    } else if (
      this.service.companyProfileModel.website == '' ||
      this.service.companyProfileModel.website === null ||
      this.service.companyProfileModel.website === undefined
    ) {
      this.toastr.error('Website is required');
      return false;
    }
    return true;
  }

  submitCompanyProfile() {
    if (this.validation() == true) {
      this.isLoading = true;

      const payload = {
        companyName: this.service.companyProfileModel.companyName,
        address: this.service.companyProfileModel.address,
        phoneNumber: this.service.companyProfileModel.phoneNumber,
        vatOrPan: true,
        vatPanNumber: this.service.companyProfileModel.vatOrPan,
        companyLogo: this.imagePreview,
        email: this.service.companyProfileModel.email,
        website: this.service.companyProfileModel.website,
        extra1: 'string',
        extra2: 'string',
      };
      this.service.companyProfile(payload).subscribe({
        next: (res: any) => {
          console.log(res);
          this.toastr.success('Registered succefully ');
          this.isLoading = false;
          this.reset();
          this.fetchCompanyList();
        },
        error: (err: any) => {
          this.isLoading = false;
        },
        complete: () => {
          this.isLoading = false; // ✅ unlock button after response
        },
      });
    }
  }

  // Image Upload ===========================================================

  imagePreview: string | ArrayBuffer | null = null;

  onFileSelected(event: any): void {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = () => {
        this.imagePreview = reader.result;
      };

      reader.readAsDataURL(file);
    }
  }

  resetImage(): void {
    this.imagePreview = null;
  }

  // Image Upload End===========================================================

  reset() {
    this.service.companyProfileModel.companyName = '';
    this.service.companyProfileModel.address = '';
    this.service.companyProfileModel.phoneNumber = '';

    this.service.companyProfileModel.vatOrPan = '';
    this.imagePreview = '';
    this.service.companyProfileModel.email = '';
    this.service.companyProfileModel.website = '';
  }

  // List Company in the table ===========================================================

  companyList: any[] = [];

  fetchCompanyList() {
    this.isLoading = true;
    this.service.getCompanyList().subscribe({
      next: (res: any) => {
        this.companyList = res;
        this.isLoading = false;
      },
      error: (err: any) => {
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }
  // Edit Company in the table ===========================================================

  // editCompany() {
  //   const payload = {
  //     companyName: this.companyName,
  //     address: this.address,
  //     phoneNumber: this.phoneNumber,
  //     companyLogo: this.companyLogo,

  //     companyName: 'string',
  //     address: 'string',
  //     phoneNumber: 'string',
  //     vatOrPan: true,
  //     vatPanNumber: 'string',
  //     companyLogo: 'string',
  //     email: 'string',
  //     website: 'string',
  //     extra1: 'string',
  //     extra2: 'string',
  //   };

  //   this.service.companyUpdate(this.companyId, payload).subscribe({
  //     next: (res) => {
  //       console.log('Updated successfully', res);
  //     },
  //     error: (err) => {
  //       console.log(err);
  //     },
  //   });
  // }

  // Id:number;

  companyRow:any[] =[]

  getRowDetails(ID: number) {
    this.service.getCompanyList().subscribe({
      next: (res: any) => {
        // console.log(res, 'list');

        this.companyList = res;
        if (this.companyList) {

          const filteredData = this.companyList.filter(
            (x) => x.companyID == ID,
          );
          this.companyRow = filteredData;

          this.companyRow.map((item)=>{
              console.log(item, "data")
          })


        }
        this.isLoading = false;
      },
      error: (err: any) => {
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }
}
