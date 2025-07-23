import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HrmInfoComponent } from './hrm-info.component';

describe('HrmInfoComponent', () => {
  let component: HrmInfoComponent;
  let fixture: ComponentFixture<HrmInfoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HrmInfoComponent]
    });
    fixture = TestBed.createComponent(HrmInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
