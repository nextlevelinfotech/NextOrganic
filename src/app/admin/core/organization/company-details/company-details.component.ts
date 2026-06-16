import { CommonModule } from '@angular/common';
import { AfterViewInit, Component } from '@angular/core';

@Component({
  selector: 'app-company-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './company-details.component.html',
})
export class CompanyDetailsComponent implements AfterViewInit {
  submitButton: string = 'Save';
  resetButton: string = 'Reset';

  openDesignation:boolean =false


  closeDesignationPopup(){
    this.openDesignation =false
  }

  popDegination(){
    this.openDesignation =true
  }
  ngAfterViewInit(): void {}
}
