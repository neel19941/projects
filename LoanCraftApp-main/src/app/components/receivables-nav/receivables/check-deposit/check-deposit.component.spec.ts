import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckDepositComponent } from './check-deposit.component';

describe('CheckDepositComponent', () => {
  let component: CheckDepositComponent;
  let fixture: ComponentFixture<CheckDepositComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CheckDepositComponent]
    });
    fixture = TestBed.createComponent(CheckDepositComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
