import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailedEmiInfoComponent } from './detailed-emi-info.component';

describe('DetailedEmiInfoComponent', () => {
  let component: DetailedEmiInfoComponent;
  let fixture: ComponentFixture<DetailedEmiInfoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DetailedEmiInfoComponent]
    });
    fixture = TestBed.createComponent(DetailedEmiInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
