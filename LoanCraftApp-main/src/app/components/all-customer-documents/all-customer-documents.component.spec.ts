import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllCustomerDocumentsComponent } from './all-customer-documents.component';

describe('AllCustomerDocumentsComponent', () => {
  let component: AllCustomerDocumentsComponent;
  let fixture: ComponentFixture<AllCustomerDocumentsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AllCustomerDocumentsComponent]
    });
    fixture = TestBed.createComponent(AllCustomerDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
