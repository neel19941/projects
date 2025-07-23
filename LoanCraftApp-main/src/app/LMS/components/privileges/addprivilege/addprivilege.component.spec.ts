import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddprivilegeComponent } from './addprivilege.component';

describe('AddprivilegeComponent', () => {
  let component: AddprivilegeComponent;
  let fixture: ComponentFixture<AddprivilegeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddprivilegeComponent]
    });
    fixture = TestBed.createComponent(AddprivilegeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
