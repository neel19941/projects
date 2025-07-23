import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleActionsComponent } from './role-actions.component';

describe('RoleActionsComponent', () => {
  let component: RoleActionsComponent;
  let fixture: ComponentFixture<RoleActionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RoleActionsComponent]
    });
    fixture = TestBed.createComponent(RoleActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
