import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerApplicationTrackingComponent } from './customer-application-tracking.component';

describe('CustomerApplicationTrackingComponent', () => {
  let component: CustomerApplicationTrackingComponent;
  let fixture: ComponentFixture<CustomerApplicationTrackingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CustomerApplicationTrackingComponent]
    });
    fixture = TestBed.createComponent(CustomerApplicationTrackingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
