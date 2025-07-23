import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SanctionedListsComponent } from './sanctioned-lists.component';

describe('SanctionedListsComponent', () => {
  let component: SanctionedListsComponent;
  let fixture: ComponentFixture<SanctionedListsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SanctionedListsComponent]
    });
    fixture = TestBed.createComponent(SanctionedListsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
