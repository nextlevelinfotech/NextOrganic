import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { RedZoomModule } from 'ngx-red-zoom';
import Splide from '@splidejs/splide';
import { HeaderComponent } from '../../../header/header.component';
import { FooterComponent } from '../../../footer/footer.component';

@Component({
  selector: 'app-shop-single',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    RedZoomModule,
    HeaderComponent,
    FooterComponent,
  ],
  templateUrl: './shop-single.component.html',
})
export class ShopSingleComponent implements AfterViewInit {
  images = [
    {
      id: 'img1',
      // thumb: 'assets/img/products/product-img-big.png',
      // full: 'assets/img/products/product-img-big.png',
      thumb: 'https://scompiler.github.io/red-zoom-angular/assets/image-1.jpg',
      full: 'https://wittlock.github.io/ngx-image-zoom/assets/fullres.jpg',
      alt: 'Front',
    },
    {
      id: 'img2',
      thumb: 'assets/img/products/product-img-2.jpg',
      full: 'assets/img/products/product-img-2.jpg',
      alt: 'Side',
    },
    {
      id: 'img3',
      thumb: 'assets/img/products/product-img-3.jpg',
      full: 'assets/img/products/product-img-3.jpg',
      alt: 'Back',
    },
  ];

  ngAfterViewInit(): void {
    const main = new Splide('#main-carousel', {
      type: 'fade',
      pagination: false,
      arrows: false,
    });
    const thumbnails = new Splide('#thumbnail-carousel', {
      rewind: true,
      fixedWidth: 100,
      fixedHeight: 72,
      isNavigation: true,
      gap: 10,
      focus: 'center',
      pagination: false,
      cover: true,
    });

    main.sync(thumbnails);
    main.mount();
    thumbnails.mount();
  }
}
