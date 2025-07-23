import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisbursedApplicationsComponent } from './disbursed-applications.component';

describe('DisbursedApplicationsComponent', () => {
  let component: DisbursedApplicationsComponent;
  let fixture: ComponentFixture<DisbursedApplicationsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DisbursedApplicationsComponent]
    });
    fixture = TestBed.createComponent(DisbursedApplicationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
