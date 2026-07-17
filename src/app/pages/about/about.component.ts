import { AfterViewInit, Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../header/header.component';
import { FooterComponent } from '../../footer/footer.component';

@Component({
  selector: 'app-about',
  imports: [HeaderComponent, FooterComponent],
  templateUrl: './about.component.html',
})
export class AboutComponent implements OnInit, AfterViewInit{

  ngOnInit(): void {
    
  }


  ngAfterViewInit(): void {
    
  }


}
