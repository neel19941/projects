import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SanctionApplicationComponent } from './sanction-application.component';

describe('SanctionApplicationComponent', () => {
  let component: SanctionApplicationComponent;
  let fixture: ComponentFixture<SanctionApplicationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SanctionApplicationComponent]
    });
    fixture = TestBed.createComponent(SanctionApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
