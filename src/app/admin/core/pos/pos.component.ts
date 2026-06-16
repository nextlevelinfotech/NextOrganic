import { CommonModule } from '@angular/common';
import { AfterViewInit, Component } from '@angular/core';

declare var bootstrap: any;

@Component({
  selector: 'app-pos',
  imports: [CommonModule],
  templateUrl: './pos.component.html',
  styleUrl: './pos.component.css',
})
export class PosComponent implements AfterViewInit {
  showPopup: boolean = false;

  openPopup() {
    this.showPopup = true;
  }

  closePopup() {
    this.showPopup = false;
  }
  ngAfterViewInit() {
    const tooltipTriggerList = document.querySelectorAll(
      '[data-bs-toggle="tooltip"]',
    );
    tooltipTriggerList.forEach((el) => {
      new bootstrap.Tooltip(el);
    });
  }
  selectedCategory: string = 'all';

  selectCategory(category: string) {
    this.selectedCategory = category;
  }
}
