import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPrivilegeComponent } from './add-privilege.component';

describe('AddPrivilegeComponent', () => {
  let component: AddPrivilegeComponent;
  let fixture: ComponentFixture<AddPrivilegeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AddPrivilegeComponent]
    });
    fixture = TestBed.createComponent(AddPrivilegeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
