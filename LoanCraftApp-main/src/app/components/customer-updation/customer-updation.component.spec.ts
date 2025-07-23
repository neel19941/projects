import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerUpdationComponent } from './customer-updation.component';

describe('CustomerUpdationComponent', () => {
  let component: CustomerUpdationComponent;
  let fixture: ComponentFixture<CustomerUpdationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CustomerUpdationComponent]
    });
    fixture = TestBed.createComponent(CustomerUpdationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
