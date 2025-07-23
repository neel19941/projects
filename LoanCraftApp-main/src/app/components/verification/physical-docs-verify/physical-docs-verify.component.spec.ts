import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhysicalDocsVerifyComponent } from './physical-docs-verify.component';

describe('PhysicalDocsVerifyComponent', () => {
  let component: PhysicalDocsVerifyComponent;
  let fixture: ComponentFixture<PhysicalDocsVerifyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PhysicalDocsVerifyComponent]
    });
    fixture = TestBed.createComponent(PhysicalDocsVerifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
