import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LowChequeDepositRequestComponent } from './low-cheque-deposit-request.component';

describe('LowChequeDepositRequestComponent', () => {
  let component: LowChequeDepositRequestComponent;
  let fixture: ComponentFixture<LowChequeDepositRequestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [LowChequeDepositRequestComponent]
    });
    fixture = TestBed.createComponent(LowChequeDepositRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
