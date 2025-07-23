import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChequeDepositRequestComponent } from './cheque-deposit-request.component';

describe('ChequeDepositRequestComponent', () => {
  let component: ChequeDepositRequestComponent;
  let fixture: ComponentFixture<ChequeDepositRequestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ChequeDepositRequestComponent]
    });
    fixture = TestBed.createComponent(ChequeDepositRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
