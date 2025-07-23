import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MissingDocumentsUploadComponent } from './missing-documents-upload.component';

describe('MissingDocumentsUploadComponent', () => {
  let component: MissingDocumentsUploadComponent;
  let fixture: ComponentFixture<MissingDocumentsUploadComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MissingDocumentsUploadComponent]
    });
    fixture = TestBed.createComponent(MissingDocumentsUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
