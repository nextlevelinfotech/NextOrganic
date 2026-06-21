import { TestBed } from '@angular/core/testing';

import { ShopCommonService } from './shop-common.service';

describe('ShopCommonService', () => {
  let service: ShopCommonService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShopCommonService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
