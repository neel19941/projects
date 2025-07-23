import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectedApplicationsComponent } from './rejected-applications.component';

describe('RejectedApplicationsComponent', () => {
  let component: RejectedApplicationsComponent;
  let fixture: ComponentFixture<RejectedApplicationsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RejectedApplicationsComponent]
    });
    fixture = TestBed.createComponent(RejectedApplicationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
