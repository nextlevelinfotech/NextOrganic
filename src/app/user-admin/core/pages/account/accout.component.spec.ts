import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccoutComponent } from './accout.component';

describe('AccoutComponent', () => {
  let component: AccoutComponent;
  let fixture: ComponentFixture<AccoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
