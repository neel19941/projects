import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerRequestsComponent } from './customer-requests.component';

describe('CustomerRequestsComponent', () => {
  let component: CustomerRequestsComponent;
  let fixture: ComponentFixture<CustomerRequestsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CustomerRequestsComponent]
    });
    fixture = TestBed.createComponent(CustomerRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
