

import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  imports: [CommonModule, RouterModule],
  templateUrl: './footer.component.html'
})
export class FooterComponent implements AfterViewInit, OnDestroy {

  showBackToTop = false;

  ngAfterViewInit(): void {
    window.addEventListener('scroll', this.toggleBackToTopButton);
  }

  ngOnDestroy(): void {
    window.removeEventListener('scroll', this.toggleBackToTopButton);
  }

  toggleBackToTopButton = (): void => {
    this.showBackToTop = window.scrollY > 300;
  };

  scrollToTop(): void {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
}