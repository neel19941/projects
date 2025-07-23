import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerApplicationsComponent } from './customer-applications.component';

describe('CustomerApplicationsComponent', () => {
  let component: CustomerApplicationsComponent;
  let fixture: ComponentFixture<CustomerApplicationsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CustomerApplicationsComponent]
    });
    fixture = TestBed.createComponent(CustomerApplicationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
