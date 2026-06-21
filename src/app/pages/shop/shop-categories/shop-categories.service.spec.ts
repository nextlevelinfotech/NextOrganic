import { TestBed } from '@angular/core/testing';

import { ShopCategoriesService } from './shop-categories.service';

describe('ShopCategoriesService', () => {
  let service: ShopCategoriesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShopCategoriesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
