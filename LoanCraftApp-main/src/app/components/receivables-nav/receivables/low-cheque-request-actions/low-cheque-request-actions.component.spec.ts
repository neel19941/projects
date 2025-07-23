import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LowChequeRequestActionsComponent } from './low-cheque-request-actions.component';

describe('LowChequeRequestActionsComponent', () => {
  let component: LowChequeRequestActionsComponent;
  let fixture: ComponentFixture<LowChequeRequestActionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [LowChequeRequestActionsComponent]
    });
    fixture = TestBed.createComponent(LowChequeRequestActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
