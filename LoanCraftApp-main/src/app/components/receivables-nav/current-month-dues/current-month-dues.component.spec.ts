import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentMonthDuesComponent } from './current-month-dues.component';

describe('CurrentMonthDuesComponent', () => {
  let component: CurrentMonthDuesComponent;
  let fixture: ComponentFixture<CurrentMonthDuesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CurrentMonthDuesComponent]
    });
    fixture = TestBed.createComponent(CurrentMonthDuesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
