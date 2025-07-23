import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentApplicationsComponent } from './payment-applications.component';

describe('PaymentApplicationsComponent', () => {
  let component: PaymentApplicationsComponent;
  let fixture: ComponentFixture<PaymentApplicationsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PaymentApplicationsComponent]
    });
    fixture = TestBed.createComponent(PaymentApplicationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
