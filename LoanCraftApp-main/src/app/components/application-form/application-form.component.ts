import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';

import { LoanService } from 'src/app/services/loan.service';
import { Router } from '@angular/router';
import { SuccessDataService } from 'src/app/core/services/success-data.service';
import { IdentityProof, LoanModel, References } from './loan-model';
import { NgToastService } from 'ng-angular-popup';
import { HttpParams } from '@angular/common/http';
import { TitleCaseDirective } from 'src/app/core/directives/title-case.directive';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';

@Component({
  selector: 'app-application-form',
  standalone: true,
  imports: [CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TitleCaseDirective],
  templateUrl: './application-form.component.html',
  styleUrls: ['./application-form.component.scss']
})

export class ApplicationFormComponent {

  loanForm!: FormGroup;
  LoanModelObj: LoanModel = new LoanModel();
  currentPage = 1;
  totalPages = 2;

  // selectedFile: File | null = null;
  // fileUploadError: string | null = null;

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

  // Reference to the sections
  employmentTypes: string[] = ['Business', 'Employee', 'Others'];
  employmentCategories: string[] = ['Govt Employee', 'Private Employee'];
  othersType = false;
  employeeCategory = false;
  isSubmitting = false;
  incomeTotal: number = 0;
  expenditureTotal: number = 0;
  netIncome: number = 0;
  private toast = inject(CustomToastService);

  constructor(private fb: FormBuilder, private api: LoanService, private rtr: Router, private successData: SuccessDataService) { }

  ngOnInit(): void {
    this.LoanForm();
    this.addReference();
    this.DynamicProofvalidation();
    this.handleEmploymentTypeChange();
    this.handleEmploymentCategoryChange();
  }

  LoanForm() {
    this.loanForm = this.fb.group({
      empemploymentType: ['', Validators.required],
      empotherDetails: [''],
      employmentCategory: [''],
      empsalary: ['', [Validators.required, Validators.pattern("^[0-9,]+$"), Validators.min(1)]],
      // empyearsinEmployment: ['', [Validators.required, Validators.pattern('^[0-9]+(\.[0-9]{1,2})?$'), Validators.min(0.1)]],
      empyearsinEmployment: ['', [ Validators.required, Validators.pattern('^[0-9]+(\\.[0-9]{1,2})?$'), Validators.min(0.1), Validators.max(100)]],
      // empcompanyName: ['', [Validators.required, Validators.minLength(3), Validators.pattern('^[a-zA-Z ]*$')]],
      empcompanyName: ['',[Validators.required, Validators.minLength(3), Validators.pattern(/^(?!\s*$)[a-zA-Z0-9 ]+$/)]],
      // empcompanyAdrees: ['', [Validators.required]],
      empcompanyAdrees: ['', [ Validators.required,  Validators.pattern(/^(?!\s*$).+/)]],
      // emppincode: ['', [Validators.required, Validators.pattern('^[0-9]{6}$')]],
      emppincode: ['', [Validators.required, Validators.pattern('^(?!0{6}$)[0-9]{6}$')]],
      applicantAddressDocumentProof: ['', Validators.required],
      applicantAddressNumberProof: ['', Validators.required],
      applicantAddressIssueDateProof: [''],
      applicantAddressExpDateProof: [''],
      DloanAmount: ['', [Validators.required, Validators.pattern("^[0-9,]+$"), Validators.min(1)]],
      // loanTenure: ['', [Validators.required, Validators.pattern('^[0-9]+$'), Validators.min(1)]],
      loanTenure: ['', [ Validators.required, Validators.pattern('^[0-9]+$'), Validators.min(1), Validators.max(100)]],
      repaymentMode: ['', Validators.required],
      references: this.fb.array([]), // Initialize the FormArray
    });
  }

  addReference() {
    const referenceGroup = this.fb.group({
      // fullName: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\s]+$/)]],
      fullName: ['', [Validators.required, Validators.pattern(/^(?!\s*$)[a-zA-Z\s]+$/)]],
      // knownForYears: ['', [Validators.required, Validators.pattern('^[0-9]+$'), Validators.min(1)]],
      knownForYears: ['', [Validators.required, Validators.pattern('^[0-9]+$'), Validators.min(1), Validators.max(100)]],

      relation: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\s]+$/)]],
      // mobile: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      mobile: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]]
    });
    this.references.push(referenceGroup);
  }


  convertToUppercase() {
    const control = this.loanForm.get('applicantAddressNumberProof');
    if (control) {
      control.setValue(control.value?.toUpperCase(), { emitEvent: false });
    }
  }

  DynamicProofvalidation() {
    this.loanForm.get('applicantAddressDocumentProof')?.valueChanges.subscribe((documentType) => {
      const numberControl = this.loanForm.get('applicantAddressNumberProof');
      // if (documentType === 'Aadhar') {
      //   numberControl?.setValidators([
      //     Validators.required,
      //     // Validators.pattern('^[0-9]{12}$'), // 12-digit Aadhaar
      //     Validators.pattern('^(?!0{12})[0-9]{12}$'), // 12-digit Aadhaar but not all zeros
      //   ]);
      // } else 
      if (documentType === 'PAN') {
        numberControl?.setValidators([
          Validators.required,
          Validators.pattern('^[A-Z]{5}[0-9]{4}[A-Z]{1}$'), // PAN format
        ]);
      } else if (documentType === 'Voter ID') {
        numberControl?.setValidators([
          Validators.required,
          Validators.pattern('^[A-Z]{3}[0-9]{7}$'), // Voter ID format
        ]);
      } else if (documentType === 'Driving License') {
        numberControl?.setValidators([
          Validators.required,
          Validators.pattern('^[A-Z]{2}[0-9]{2}[A-Z0-9]{4}[0-9]{1,7}$'), // Driving License format
        ]);
      } else if (documentType === 'Passport') {
        numberControl?.setValidators([
          Validators.required,
          Validators.pattern('^[A-Z]{1}[0-9]{7}$'), // Passport format
        ]);
      } else {
        numberControl?.clearValidators(); // Clear validators if no valid document type is selected
      }
      // Update validation status
      numberControl?.updateValueAndValidity();
    });
  }
  handleEmploymentTypeChange(): void {
    this.loanForm.get('empemploymentType')?.valueChanges.subscribe(value => {
      const otherDetailsControl = this.loanForm.get('empotherDetails');

      if (value === 'Others') {
        this.othersType = true;
        // otherDetailsControl?.setValidators([
        //   Validators.required,
        //   Validators.pattern("^[a-zA-Z ]+$"),
        //   Validators.minLength(3)
        // ]);
        otherDetailsControl?.setValidators([
           Validators.required,
           Validators.pattern(/^(?!\s*$)[a-zA-Z\s]+$/),  // ⬅️ updated regex
           Validators.minLength(3)
    ]);

      } else {
        this.othersType = false;
        otherDetailsControl?.clearValidators();
        otherDetailsControl?.setValue('');
      }

      otherDetailsControl?.updateValueAndValidity();
    });
  }
  handleEmploymentCategoryChange(): void {
    this.loanForm.get('empemploymentType')?.valueChanges.subscribe(value => {
      const employmentCategoryControl = this.loanForm.get('employmentCategory');

      if (value === 'Employee') {
        this.employeeCategory = true;
        employmentCategoryControl?.setValidators(Validators.required);
      } else {
        this.employeeCategory = false;
        employmentCategoryControl?.clearValidators();
        employmentCategoryControl?.setValue('');
      }

      employmentCategoryControl?.updateValueAndValidity();
    });
  }

  showSnackbar(message: string, type: 'success' | 'error') {
    const snackbar = document.getElementById('customSnackbar');
    const messageContainer = document.getElementById('notificationMessage');
    const iconContainer = document.getElementById('notificationIcon');

    if (snackbar && messageContainer && iconContainer) {
      messageContainer.textContent = message;

      // Update classes and icon
      snackbar.className = `custom-snackbar show ${type}`;
      if (type === 'success') {
        iconContainer.className = 'bi bi-check-circle'; // Bootstrap success icon
      } else if (type === 'error') {
        iconContainer.className = 'bi bi-exclamation-circle'; // Bootstrap error icon
      }

      // Show the snackbar for 3 seconds
      setTimeout(() => {
        snackbar.className = snackbar.className.replace('show', '').trim();
      }, 3000);
    }
  }

  checkDuplicateAadhaar() {
    const aadhaarNumber = this.loanForm.get('adhaarNumber')?.value;
    if (aadhaarNumber.toString().length === 12) {
      this.api.checkDuplicateAadhaar(aadhaarNumber).subscribe(
        (response) => {
          if (response.status.trim() === 'failed') {
            this.showSnackbar('This Aadhaar number is already registered. Try another one.', 'error');
            this.loanForm.reset();
          } else {

          }
        },
        (error) => {
          console.error('Error checking Aadhaar:', error);
          this.showSnackbar('Failed to verify Aadhaar. Please try again later.', 'error');
        }
      );
    }
  }

  // Method to remove a reference by index
  removeReference(index: number) {
    this.references.removeAt(index);
  }
  // Getter for references FormArray
  get references() {
    return this.loanForm.get('references') as FormArray;
  }

  // Retrieve customer ID
  private getId(): any {
    return localStorage.getItem("customerId");
  }


  nextPage() {
    if (this.currentPage === 1) {
      const page1Controls = [
        'empemploymentType',
        'empsalary',
        'empyearsinEmployment',
        'empcompanyName',
        'empcompanyAdrees',
        'emppincode',
        'applicantAddressDocumentProof',
        'applicantAddressNumberProof'
      ];

      let isValid = true;

      const empemploymentType = this.loanForm.get('empemploymentType')?.value;

      if (empemploymentType === 'Others') {
        page1Controls.push('empotherDetails');
      }

      if (empemploymentType === 'Employee') {
        page1Controls.push('employmentCategory');
      }

      // Validate form fields
      page1Controls.forEach(controlName => {
        const control = this.loanForm.get(controlName);
        if (control) {
          control.markAsTouched();
          control.updateValueAndValidity();
          if (control.invalid) {
            isValid = false;
          }
        }
      });

      // === File validations ===
      this.bankStatementFileErrors = [];
      this.payslipFileErrors = [];
      this.otherFileErrors = [];
      this.aadharCardError = null;
      this.panCardError = null;

      if (this.bankStatementFiles.length === 0) {
        this.bankStatementFileErrors.push('Bank Statement file(s) are required.');
        isValid = false;
      }

      if (this.payslipFiles.length === 0) {
        this.payslipFileErrors.push('Payslip file(s) are required.');
        isValid = false;
      }

      if (!this.aadharCardFile) {
        this.aadharCardError = 'Aadhar card file is required.';
        isValid = false;
      }

      if (!this.panCardFile) {
        this.panCardError = 'PAN card file is required.';
        isValid = false;
      }


      // ✅ Check total size of otherFiles (must be < 1MB)
      const maxOtherFileSize = 1 * 1024 * 1024; // 1MB in bytes
      const totalOtherFilesSize = this.otherFiles.reduce((sum, file) => sum + file.size, 0);

      // alert("other files length " + this.otherFiles.length + "total filesszie  " + totalOtherFilesSize + "maxOtherFileSize " + maxOtherFileSize);
      if (this.otherFiles.length > 0 && totalOtherFilesSize > maxOtherFileSize) {
        this.otherFileErrors.push('Total size of other files must be less than 1MB.');
        // Clear the files again for safety
        this.otherFiles = [];
        this.selectedOtherFileNames = '';


        isValid = false;
      }

      if (!isValid) {
        return;
      }
    }

    // Move to next page
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.scrollToTop('loan-container');
    }
  }


  // Navigate to the previous page
  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      // this.scrollToSection();
      this.scrollToTop('loan-container');
    }
  }

  scrollToTop(sectionId: string) {
    const container = document.getElementById(sectionId);
    if (container) {
      console.log(container);
      container.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  // Method to check if a form control is invalid and touched or dirty
  isFieldInvalid(field: string): boolean {
    const control = this.loanForm.get(field);
    return !!(control && control.invalid && (control.touched || control.dirty));
  }

  onIssueDateChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const issueDate = new Date(inputElement.value);

    // Normalize issueDate and today to remove the time component
    issueDate.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (issueDate > today) {
      // Clear the issue date if it's in the future
      this.loanForm.get('applicantAddressIssueDateProof')?.setValue('');
      this.toast.error({
        detail: 'Error',
        summary: 'Issue Date cannot be in the future.',
        duration: 3000,
      });
    }
  }

  onExpiryDateChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const expiryDate = new Date(inputElement.value);
    const issueDateValue = this.loanForm.get('applicantAddressIssueDateProof')?.value;

    if (!issueDateValue) {
      // If Issue Date is not selected, clear the Expiry Date and show an alert
      this.loanForm.get('applicantAddressExpDateProof')?.setValue('');
      this.toast.error({
        detail: 'Error',
        summary: 'Please select the Issue Date first.',
        duration: 3000,
      });
      return;
    }

    const issueDate = new Date(issueDateValue);

    // Normalize expiryDate and issueDate to remove the time component
    expiryDate.setHours(0, 0, 0, 0);
    issueDate.setHours(0, 0, 0, 0);

    // Normalize the current date to remove the time component
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if Expiry Date is before Issue Date
    if (expiryDate <= issueDate) {
      this.loanForm.get('applicantAddressExpDateProof')?.setValue('');
      this.toast.error({
        detail: 'Error',
        summary: 'Expiry Date must be after the Issue Date.',
        duration: 3000,
      });
      return;
    }

    // Check if Expiry Date is in the past
    if (expiryDate < today) {
      this.loanForm.get('applicantAddressExpDateProof')?.setValue('');
      this.toast.error({
        detail: 'Error',
        summary: 'Expiry Date cannot be in the past.',
        duration: 3000,
      });
    }
  }
  triggerFileUpload(): void {
    const fileInput = document.getElementById('identityDocument') as HTMLElement;
    fileInput?.click();
  }

  formatCommas(fieldName: string) {
    let value = this.loanForm.get(fieldName)?.value;

    // Remove non-numeric characters
    value = value.replace(/[^0-9]/g, '');

    // Convert to number and format with commas
    if (value) {
      value = parseInt(value, 10).toLocaleString('en-IN'); // Indian number format
      this.loanForm.patchValue({ [fieldName]: value }, { emitEvent: false });
    }
  }


  // onBankStatementSelected(event: Event): void {
  //   const input = event.target as HTMLInputElement;
  //   this.bankStatementFiles = [];
  //   this.bankStatementFileErrors = [];
  //   this.selectedBankStatementFileNames = '';

  //   if (input.files?.length) {
  //     const files = Array.from(input.files);
  //     const totalSize = files.reduce((sum, file) => sum + file.size, 0);

  //     // 1MB = 1 * 1024 * 1024 bytes
  //     const MAX_TOTAL_SIZE = 1 * 1024 * 1024;

  //     if (totalSize > MAX_TOTAL_SIZE) {
  //       this.bankStatementFileErrors.push(
  //         `Total files size exceeds 1MB. Please upload smaller files.`
  //       );
  //       return;
  //     }

  //     this.bankStatementFiles = files;
  //     this.selectedBankStatementFileNames = files.map(f => f.name).join(', ');
  //   }
  // }
onBankStatementSelected(event: Event): void {
  const input = event.target as HTMLInputElement;
  this.bankStatementFileErrors = [];

  if (input.files?.length) {
    const newFiles = Array.from(input.files);

    // Merge existing files with newly selected files
    const allFiles = [...this.bankStatementFiles, ...newFiles];

    // Remove duplicates by name (you can improve this logic if needed)
    const uniqueFilesMap = new Map<string, File>();
    allFiles.forEach(file => uniqueFilesMap.set(file.name, file));

    const mergedFiles = Array.from(uniqueFilesMap.values());

    const totalSize = mergedFiles.reduce((sum, file) => sum + file.size, 0);
    const MAX_TOTAL_SIZE = 1 * 1024 * 1024;

    if (totalSize > MAX_TOTAL_SIZE) {
      this.bankStatementFileErrors.push(
        `Total files size exceeds 1MB. Please upload smaller files.`
      );
      return;
    }

    this.bankStatementFiles = mergedFiles;
    this.selectedBankStatementFileNames = mergedFiles.map(f => f.name).join(', ');

    // Reset input value to allow same file to be selected again if needed
    input.value = '';
  }
}


removeBankStatementFile(index: number): void {
  this.bankStatementFiles.splice(index, 1);
  this.selectedBankStatementFileNames = this.bankStatementFiles.map(f => f.name).join(', ');
}
removePayslipFile(index: number): void {
  this.payslipFiles.splice(index, 1);
  this.selectedPayslipFileNames = this.payslipFiles.map(f => f.name).join(', ');
}

removeOtherFile(index: number): void {
  this.otherFiles.splice(index, 1);
  this.selectedOtherFileNames = this.otherFiles.map(f => f.name).join(', ');
}


  // onAadharCardSelected(event: Event): void {
  //   const input = event.target as HTMLInputElement;
  //   if (input.files?.length) {
  //     const file = input.files[0];
  //     if (!this.validateFile(file)) {
  //       this.aadharCardError = 'File under 1MB are allowed.';
  //       this.aadharCardFile = null;
  //     } else {
  //       this.aadharCardError = null;
  //       this.aadharCardFile = file;
  //     }
  //   }
  // }
onAadharCardSelected(event: Event): void {
  const input = event.target as HTMLInputElement;

  if (input.files?.length) {
    const file = input.files[0];

    if (!this.validateFile(file)) {
      this.aadharCardError = 'File under 1MB are allowed.';
      this.aadharCardFile = null;
    } else {
      this.aadharCardError = null;
      this.aadharCardFile = file;
    }

    input.value = ''; // allow re-selecting the same file
  }
}

removeAadharCardFile(): void {
  this.aadharCardFile = null;
  this.aadharCardError = null;
}

  // onPanCardSelected(event: Event): void {
  //   const input = event.target as HTMLInputElement;
  //   if (input.files?.length) {
  //     const file = input.files[0];
  //     if (!this.validateFile(file)) {
  //       this.panCardError = 'File under 1MB are allowed.';
  //       this.panCardFile = null;
  //     } else {
  //       this.panCardError = null;
  //       this.panCardFile = file;
  //     }
  //   }
  // }



  // onPayslipSelected(event: Event): void {
  //   const input = event.target as HTMLInputElement;
  //   this.payslipFiles = [];
  //   this.payslipFileErrors = [];
  //   this.selectedPayslipFileNames = '';

  //   if (input.files?.length) {
  //     const files = Array.from(input.files);
  //     const totalSize = files.reduce((sum, file) => sum + file.size, 0);

  //     const MAX_TOTAL_SIZE = 1 * 1024 * 1024; // 1MB

  //     if (totalSize > MAX_TOTAL_SIZE) {
  //       this.payslipFileErrors.push(
  //         `Total files size exceeds 1MB. Please upload smaller files.`
  //       );
  //       return;
  //     }

  //     this.payslipFiles = files;
  //     this.selectedPayslipFileNames = files.map(f => f.name).join(', ');
  //   }
  // }

  // onOthersSelected(event: Event): void {
  //   const input = event.target as HTMLInputElement;
  //   this.otherFiles = [];
  //   this.otherFileErrors = [];
  //   this.selectedOtherFileNames = '';

  //   if (input.files?.length) {
  //     const validFiles: File[] = [];

  //     Array.from(input.files).forEach((file) => {
  //       if (!this.validateFile(file)) {
  //         this.otherFileErrors.push(`File ${file.name} is invalid (Files under 1MB).`);
  //       } else {
  //         validFiles.push(file);
  //       }
  //     });

  //     this.otherFiles = validFiles;
  //     if (validFiles.length > 0) {
  //       this.selectedOtherFileNames = validFiles.map(f => f.name).join(', ');
  //     }
  //   }
  // }

  // // Reusable validation
  // validateFile(file: File): boolean {
  //   const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
  //   return allowedTypes.includes(file.type) && file.size <= 5 * 1024 * 1024;
  // }
onPanCardSelected(event: Event): void {
  const input = event.target as HTMLInputElement;

  if (input.files?.length) {
    const file = input.files[0];

    if (!this.validateFile(file)) {
      this.panCardError = 'File under 1MB are allowed.';
      this.panCardFile = null;
    } else {
      this.panCardError = null;
      this.panCardFile = file;
    }

    input.value = ''; // Reset input to allow re-selection of the same file
  }
}

removePanCardFile(): void {
  this.panCardFile = null;
  this.panCardError = null;
}


  onPayslipSelected(event: Event): void {
  const input = event.target as HTMLInputElement;
  this.payslipFileErrors = [];

  if (input.files?.length) {
    const newFiles = Array.from(input.files);

    // Merge existing files with newly selected files
    const allFiles = [...this.payslipFiles, ...newFiles];

    // Remove duplicates by name (can be adjusted to check type/size too)
    const uniqueFilesMap = new Map<string, File>();
    allFiles.forEach(file => uniqueFilesMap.set(file.name, file));

    const mergedFiles = Array.from(uniqueFilesMap.values());

    const totalSize = mergedFiles.reduce((sum, file) => sum + file.size, 0);
    const MAX_TOTAL_SIZE = 1 * 1024 * 1024; // 1MB

    if (totalSize > MAX_TOTAL_SIZE) {
      this.payslipFileErrors.push(
        `Total files size exceeds 1MB. Please upload smaller files.`
      );
      return;
    }

    this.payslipFiles = mergedFiles;
    this.selectedPayslipFileNames = mergedFiles.map(f => f.name).join(', ');

    // Reset input value to allow same file to be selected again
    input.value = '';
  }
}

  onOthersSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.otherFiles = [];
    this.otherFileErrors = [];
    this.selectedOtherFileNames = '';

    if (input.files?.length) {
      const files = Array.from(input.files);
      const totalSize = files.reduce((sum, file) => sum + file.size, 0);
      const MAX_TOTAL_SIZE = 1 * 1024 * 1024; // 1MB

      if (totalSize > MAX_TOTAL_SIZE) {
        this.otherFileErrors.push('Total files size exceeds 1MB. Please upload smaller files.');

        // Clear the file input field (important!)
        input.value = '';
        return;
      }

      this.otherFiles = files;
      this.selectedOtherFileNames = files.map(f => f.name).join(', ');
    }
  }


  validateFile(file: File): boolean {
    // const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    // const maxSize = 1 * 1024 * 1024; // 1MB
    // return allowedTypes.includes(file.type) && file.size <= maxSize;

    return file.size <= 1 * 1024 * 1024;
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

  // sendData() {
  //   if (this.loanForm.valid) {
  //     const customerId = this.getId();
  //     this.LoanModelObj.customerId = customerId;
  //     this.LoanModelObj.employmentType = this.loanForm.value.empemploymentType;
  //     this.LoanModelObj.empotherDetails = this.loanForm.value.empotherDetails;
  //     this.LoanModelObj.employmentCategory = this.loanForm.value.employmentCategory;
  //     this.LoanModelObj.salary = this.loanForm.value.empsalary;
  //     this.LoanModelObj.yearsinEmployment = this.loanForm.value.empyearsinEmployment;
  //     this.LoanModelObj.companyName = this.loanForm.value.empcompanyName;
  //     this.LoanModelObj.companyAddress = this.loanForm.value.empcompanyAdrees;
  //     this.LoanModelObj.pinCode = this.loanForm.value.emppincode;
  //     this.LoanModelObj.loanAmount = this.loanForm.value.DloanAmount;
  //     this.LoanModelObj.repaymentMode = this.loanForm.value.repaymentMode;
  //     this.LoanModelObj.loanTenure = this.loanForm.value.loanTenure;

  //     this.LoanModelObj.identityProof = new IdentityProof();

  //     this.LoanModelObj.identityProof.proof = this.loanForm.value.applicantAddressDocumentProof;
  //     this.LoanModelObj.identityProof.number = this.loanForm.value.applicantAddressNumberProof;
  //     this.LoanModelObj.identityProof.issueDate = this.loanForm.value.applicantAddressIssueDateProof;
  //     this.LoanModelObj.identityProof.expDate = this.loanForm.value.applicantAddressExpDateProof;

  //     // References Mapping (Loop through FormArray)
  //     const references = this.loanForm.get('references') as FormArray;
  //     this.LoanModelObj.reference = references.controls.map(referenceControl => {
  //       const reference = referenceControl.value;
  //       const referenceDetails = new References();
  //       referenceDetails.fullName = reference.fullName;
  //       referenceDetails.knownForYears = reference.knownForYears;
  //       referenceDetails.relationship = reference.relation;
  //       // referenceDetails.pincode = reference.pincode;
  //       referenceDetails.mobilenumber = reference.mobile;
  //       return referenceDetails;
  //     });

  //     // Set the loading flag to true
  //     this.isSubmitting = true;
  //     // Send the populated LoanModel object to the service
  //     this.api.postUser(this.LoanModelObj).subscribe(response => {
  //       console.log('Data sent successfully:', response);
  //       // Save the reference ID in the service
  //       this.successData.setReferenceId(response.data.applicationReferenceId);
  //       this.isSubmitting = false; // Turn off the loader
  //       this.rtr.navigate(['body/success']);
  //       // this.rtr.navigate(['top-navbar/success']);
  //       this.loanForm.reset();
  //     }, error => {
  //       this.isSubmitting = false; // Turn off the loader
  //       console.error('Error sending data:', error);
  //     });

  //   } else {
  //     // If the form is invalid, mark all controls as touched to show validation errors
  //     this.loanForm.markAllAsTouched();
  //     console.log('Form is not valid. Please correct the errors.');
  //   }
  // }

  sendData() {
    if (this.loanForm.valid && this.panCardFile) {
      const customerId = this.getId();
      this.LoanModelObj.customerId = customerId;
      // Map form fields to model
      this.LoanModelObj.employmentType = this.loanForm.value.empemploymentType;
      this.LoanModelObj.empotherDetails = this.loanForm.value.empotherDetails;
      this.LoanModelObj.employmentCategory = this.loanForm.value.employmentCategory;
      this.LoanModelObj.salary = this.loanForm.value.empsalary.replace(/,/g, '');
      this.LoanModelObj.yearsinEmployment = this.loanForm.value.empyearsinEmployment;
      this.LoanModelObj.companyName = this.loanForm.value.empcompanyName;
      this.LoanModelObj.companyAddress = this.loanForm.value.empcompanyAdrees;
      this.LoanModelObj.pinCode = this.loanForm.value.emppincode;
      this.LoanModelObj.loanAmount = this.loanForm.value.DloanAmount.replace(/,/g, '');
      this.LoanModelObj.repaymentMode = this.loanForm.value.repaymentMode;
      this.LoanModelObj.loanTenure = this.loanForm.value.loanTenure;
      this.LoanModelObj.identityProof = new IdentityProof();
      this.LoanModelObj.identityProof.proof = this.loanForm.value.applicantAddressDocumentProof;
      this.LoanModelObj.identityProof.number = this.loanForm.value.applicantAddressNumberProof;
      this.LoanModelObj.identityProof.issueDate = this.loanForm.value.applicantAddressIssueDateProof;
      this.LoanModelObj.identityProof.expDate = this.loanForm.value.applicantAddressExpDateProof;
      // References Mapping (Loop through FormArray)
      const references = this.loanForm.get('references') as FormArray;
      this.LoanModelObj.reference = references.controls.map(referenceControl => {
        const reference = referenceControl.value;
        const referenceDetails = new References();
        referenceDetails.fullName = reference.fullName;
        referenceDetails.knownForYears = reference.knownForYears;
        referenceDetails.relationship = reference.relation;
        // referenceDetails.pincode = reference.pincode;
        referenceDetails.mobilenumber = reference.mobile;
        return referenceDetails;
      });
      this.isSubmitting = true;
      this.api.postUser(this.LoanModelObj).subscribe(response => {
        const loanId = response.data.loanId;
        this.successData.setReferenceId(response.data.applicationReferenceId);
        localStorage.setItem("referenceId" , response.data.applicationReferenceId);
        const documentType = this.LoanModelObj.identityProof.proof;
        const formData = new FormData();
        // formData.append('file', this.selectedFile!);
        formData.append('customerId', customerId);
        formData.append('loanId', loanId);
        formData.append('documentType', documentType);
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
            // if (response?.status === 'success') {
            console.log('Document uploaded');
            this.rtr.navigate(['body/success']);
            this.loanForm.reset();
            // } else {
            //   this.toast.error({ detail: 'Document Upload Failed' });
            // }
            this.isSubmitting = false;
          },
          error: (error) => {
            this.toast.error({ detail: 'Document Upload Failed' });
            this.isSubmitting = false;
          }
        });

      }, error => {

        this.isSubmitting = false;
      });
    } else {
      // Either form is invalid or file is not selected
      this.loanForm.markAllAsTouched();

    }
  }


}
