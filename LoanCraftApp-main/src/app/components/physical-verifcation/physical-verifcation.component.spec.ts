import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhysicalVerifcationComponent } from './physical-verifcation.component';

describe('PhysicalVerifcationComponent', () => {
  let component: PhysicalVerifcationComponent;
  let fixture: ComponentFixture<PhysicalVerifcationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PhysicalVerifcationComponent]
    });
    fixture = TestBed.createComponent(PhysicalVerifcationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
