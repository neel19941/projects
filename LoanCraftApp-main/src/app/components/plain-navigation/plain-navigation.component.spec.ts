import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlainNavigationComponent } from './plain-navigation.component';

describe('PlainNavigationComponent', () => {
  let component: PlainNavigationComponent;
  let fixture: ComponentFixture<PlainNavigationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PlainNavigationComponent]
    });
    fixture = TestBed.createComponent(PlainNavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
