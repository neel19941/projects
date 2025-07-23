import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovedApplicationsComponent } from './approved-applications.component';

describe('ApprovedApplicationsComponent', () => {
  let component: ApprovedApplicationsComponent;
  let fixture: ComponentFixture<ApprovedApplicationsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ApprovedApplicationsComponent]
    });
    fixture = TestBed.createComponent(ApprovedApplicationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
