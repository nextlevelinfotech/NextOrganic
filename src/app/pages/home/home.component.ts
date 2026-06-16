import { AfterViewInit, Component, ElementRef, OnInit } from '@angular/core';
declare var $: any;
import { HeaderComponent } from '../../header/header.component';
import { FooterComponent } from '../../footer/footer.component';
import { HomeService } from './home.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    HeaderComponent,
    FooterComponent,

  ],
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit, AfterViewInit {

  constructor(  public service: HomeService,  private el: ElementRef,   private toastr: ToastrService,) { }
  ngAfterViewInit(): void {
  }
  ngOnInit(): void {
  }
}
