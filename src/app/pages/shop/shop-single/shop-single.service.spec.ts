import { TestBed } from '@angular/core/testing';

import { ShopSingleService } from './shop-single.service';

describe('ShopSingleService', () => {
  let service: ShopSingleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShopSingleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
