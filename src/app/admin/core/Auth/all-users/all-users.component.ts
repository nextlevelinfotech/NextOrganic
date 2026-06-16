import { ToastrService } from 'ngx-toastr';
import { AfterViewInit, Component, ElementRef, OnInit } from '@angular/core';
import { AllUsersService } from './all-users.service';
declare var $: any;
import 'select2';
import { CommonModule } from '@angular/common';
declare const setFocusOnNextElement: any;

@Component({
  selector: 'app-all-users',
  imports: [CommonModule],
  templateUrl: './all-users.component.html',
  styleUrl: './all-users.component.css',
})
export class AllUsersComponent implements AfterViewInit, OnInit{
  constructor(
    public service: AllUsersService,
    private toastr: ToastrService,
    private el: ElementRef,
  ) {}

  userList: any[] = [];
  isLoading: boolean = false;

  ngOnInit(): void {
    this.fetchUserList()
  }

  ngAfterViewInit(): void {
    // $('#country').focus();

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

  fetchUserList(){
     this.service.getCompanyList().subscribe({
        next: (res: any) => {
          console.log(res, 'data');
          this.isLoading = false;
          this.userList = res
        },
        error: (err: any) => {
          this.isLoading = false;
        },
        complete: () => {
          this.isLoading = false; //  unlock button after response
        },
      });
  }
}
