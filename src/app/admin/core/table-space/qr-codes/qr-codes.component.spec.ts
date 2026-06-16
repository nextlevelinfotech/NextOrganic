import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QRCodesComponent } from './qr-codes.component';

describe('QRCodesComponent', () => {
  let component: QRCodesComponent;
  let fixture: ComponentFixture<QRCodesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QRCodesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QRCodesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
