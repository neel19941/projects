import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UCRFFileUploadComponent } from './ucrf-file-upload.component';

describe('UCRFFileUploadComponent', () => {
  let component: UCRFFileUploadComponent;
  let fixture: ComponentFixture<UCRFFileUploadComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [UCRFFileUploadComponent]
    });
    fixture = TestBed.createComponent(UCRFFileUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
