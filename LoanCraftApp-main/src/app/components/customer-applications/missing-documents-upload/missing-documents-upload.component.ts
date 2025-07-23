import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LoanService } from 'src/app/services/loan.service';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';

@Component({
  selector: 'app-missing-documents-upload',
  standalone: true,
  imports: [CommonModule , FormsModule, ReactiveFormsModule,],

  templateUrl: './missing-documents-upload.component.html',
  styleUrls: ['./missing-documents-upload.component.scss']
})
export class MissingDocumentsUploadComponent {
  @Output() closeModal: EventEmitter<void> = new EventEmitter();
  @Input() LoanId!: string;

  missDocsForm!: FormGroup;
  bankStatementFiles: File[] = [];
  bankStatementFileErrors: string[] = [];
  selectedBankStatementFileNames: string = '';

  aadharCardFile: File | null = null;
  aadharCardError: string | null = null;

  panCardFile: File | null = null;
  panCardError: string | null = null;

  payslipFiles: File[] = [];
  payslipFileErrors: string[] = [];
  selectedPayslipFileNames: string = '';

  otherFiles: File[] = [];
  otherFileErrors: string[] = [];
  selectedOtherFileNames: string = '';

  constructor(private fb: FormBuilder ,private api: LoanService, private rtr: Router, private toast : CustomToastService){}
    ngOnInit(): void {
      this.missDocsForm = this.fb.group({

      });
    }

    onBankStatementSelected(event: Event): void {
      const input = event.target as HTMLInputElement;
      this.bankStatementFiles = [];
      this.bankStatementFileErrors = [];
      this.selectedBankStatementFileNames = '';
  
      if (input.files?.length) {
        const validFiles: File[] = [];
  
        Array.from(input.files).forEach((file) => {
          if (!this.validateFile(file)) {
            this.bankStatementFileErrors.push(`File ${file.name} is invalid (Only JPG, PNG, PDF under 5MB).`);
          } else {
            validFiles.push(file);
          }
        });
  
        this.bankStatementFiles = validFiles;
        if (validFiles.length > 0) {
          this.selectedBankStatementFileNames = validFiles.map(f => f.name).join(', ');
        }
      }
    }
  
    onAadharCardSelected(event: Event): void {
      const input = event.target as HTMLInputElement;
      if (input.files?.length) {
        const file = input.files[0];
        if (!this.validateFile(file)) {
          this.aadharCardError = 'Only JPG, PNG, and PDF files under 5MB are allowed.';
          this.aadharCardFile = null;
        } else {
          this.aadharCardError = null;
          this.aadharCardFile = file;
        }
      }
    }
    onPanCardSelected(event: Event): void {
      const input = event.target as HTMLInputElement;
      if (input.files?.length) {
        const file = input.files[0];
        if (!this.validateFile(file)) {
          this.panCardError = 'Only JPG, PNG, and PDF files under 5MB are allowed.';
          this.panCardFile = null;
        } else {
          this.panCardError = null;
          this.panCardFile = file;
        }
      }
    }
  
    onPayslipSelected(event: Event): void {
      const input = event.target as HTMLInputElement;
      this.payslipFiles = [];
      this.payslipFileErrors = [];
      this.selectedPayslipFileNames = '';
  
      if (input.files?.length) {
        const validFiles: File[] = [];
  
        Array.from(input.files).forEach((file) => {
          if (!this.validateFile(file)) {
            this.payslipFileErrors.push(`File ${file.name} is invalid (Only JPG, PNG, PDF under 1MB).`);
          } else {
            validFiles.push(file);
          }
        });
  
        this.payslipFiles = validFiles;
        if (validFiles.length > 0) {
          this.selectedPayslipFileNames = validFiles.map(f => f.name).join(', ');
        }
      }
    }
  
    onOthersSelected(event: Event): void {
      const input = event.target as HTMLInputElement;
      this.otherFiles = [];
      this.otherFileErrors = [];
      this.selectedOtherFileNames = '';
  
      if (input.files?.length) {
        const validFiles: File[] = [];
  
        Array.from(input.files).forEach((file) => {
          if (!this.validateFile(file)) {
            this.otherFileErrors.push(`File ${file.name} is invalid (Only JPG, PNG, PDF under 5MB).`);
          } else {
            validFiles.push(file);
          }
        });
  
        this.otherFiles = validFiles;
        if (validFiles.length > 0) {
          this.selectedOtherFileNames = validFiles.map(f => f.name).join(', ');
        }
      }
    }


    validateFile(file: File): boolean {
      const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
      const maxSize = 1 * 1024 * 1024; // 1MB
      return allowedTypes.includes(file.type) && file.size <= maxSize;
    }
    
    // Trigger methods for each file input
    triggerBankStatementUpload(): void {
      (document.getElementById('bankStatement') as HTMLInputElement)?.click();
    }
  
    triggerAadharCardUpload(): void {
      (document.getElementById('aadharCard') as HTMLInputElement)?.click();
    }
  
    triggerPanCardUpload(): void {
      (document.getElementById('panCard') as HTMLInputElement)?.click();
    }
  
    triggerPayslipUpload(): void {
      (document.getElementById('payslip') as HTMLInputElement)?.click();
    }
  
    triggerOthersUpload(): void {
      (document.getElementById('otherDocuments') as HTMLInputElement)?.click();
    }
      // Retrieve customer ID
  private getId(): any {
    return localStorage.getItem("customerId");
  }
    sendData() {
      const customerId = this.getId();
      const formData = new FormData();
      // formData.append('file', this.selectedFile!);
      formData.append('customerId', customerId);
      formData.append('loanId', this.LoanId);
      // Individual files
      if (this.panCardFile) {
        formData.append('pan', this.panCardFile);
      }
      if (this.aadharCardFile) {
        formData.append('aadhaar', this.aadharCardFile);
      }
      // Multiple files (arrays)
      this.bankStatementFiles.forEach(file => {
        formData.append('bankStatements', file);
      });

      this.payslipFiles.forEach(file => {
        formData.append('payslips', file);
      });
      // Multiple files (arrays)
      this.otherFiles.forEach(file => {
        formData.append('others', file);
      });
      this.api.postWithParams("auth/documents/upload-documents", formData).subscribe({
        next: (response: any) => {
          if (response?.status === 'success') {
            console.log('Document uploaded');
            this.toast.success({
              detail: 'Success',
              summary: 'Documents uploaded successfully.',
              duration: 3000,
            });
                this.close();
          } else {
            this.toast.error({
              detail: 'Error',
              summary: 'Failed to upload documents',
              duration: 3000,
            });
          }
 
        },
        error: (error) => {
          this.toast.error({
            detail: 'Error',
            summary: 'Failed to upload documents please try again.',
            duration: 3000,
          });
    
        }
      });
    }
    close(): void {
      this.closeModal.emit();
    }
}
