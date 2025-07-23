import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceivablesNavComponent } from './receivables-nav.component';

describe('ReceivablesNavComponent', () => {
  let component: ReceivablesNavComponent;
  let fixture: ComponentFixture<ReceivablesNavComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReceivablesNavComponent]
    });
    fixture = TestBed.createComponent(ReceivablesNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
