import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckBounceListComponent } from './check-bounce-list.component';

describe('CheckBounceListComponent', () => {
  let component: CheckBounceListComponent;
  let fixture: ComponentFixture<CheckBounceListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CheckBounceListComponent]
    });
    fixture = TestBed.createComponent(CheckBounceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
