import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HrmActionsComponent } from './hrm-actions.component';

describe('HrmActionsComponent', () => {
  let component: HrmActionsComponent;
  let fixture: ComponentFixture<HrmActionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HrmActionsComponent]
    });
    fixture = TestBed.createComponent(HrmActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
