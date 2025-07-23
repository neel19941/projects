import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationsNavComponent } from './applications-nav.component';

describe('ApplicationsNavComponent', () => {
  let component: ApplicationsNavComponent;
  let fixture: ComponentFixture<ApplicationsNavComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ApplicationsNavComponent]
    });
    fixture = TestBed.createComponent(ApplicationsNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
