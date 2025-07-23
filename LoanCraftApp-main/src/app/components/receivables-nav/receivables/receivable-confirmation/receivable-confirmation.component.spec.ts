import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceivableConfirmationComponent } from './receivable-confirmation.component';

describe('ReceivableConfirmationComponent', () => {
  let component: ReceivableConfirmationComponent;
  let fixture: ComponentFixture<ReceivableConfirmationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReceivableConfirmationComponent]
    });
    fixture = TestBed.createComponent(ReceivableConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
