import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FundsOverviewComponent } from './funds-overview.component';

describe('FundsOverviewComponent', () => {
  let component: FundsOverviewComponent;
  let fixture: ComponentFixture<FundsOverviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FundsOverviewComponent]
    });
    fixture = TestBed.createComponent(FundsOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
