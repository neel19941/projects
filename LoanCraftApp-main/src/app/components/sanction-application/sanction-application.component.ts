import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgToastService } from 'ng-angular-popup';
import { LoanSanctionService } from 'src/app/services/loan-sanction.service';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';

@Component({
  selector: 'app-sanction-application',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './sanction-application.component.html',
  styleUrls: ['./sanction-application.component.scss']
})
export class SanctionApplicationComponent {

  @Output() closeModal: EventEmitter<void> = new EventEmitter();
  @Input() LoanId!: number;
  @Input() LoanAmount!: any;
  @Input() RepaymentMode!: string;

  loanSanctionForm!: FormGroup;
  private data: any;
  private customerId: any;
  processingCharge: number = 0;
  private sanctionService = inject(LoanSanctionService);
  private toast = inject(CustomToastService);
  loanAmounts: number[] = [5000, 10000, 20000, 50000, 100000]; // Define loan amounts
  emiOptions: number[] = [6, 9, 12, 15 , 18, 20, 24, 30, 36]; // EMI options in months
  repaymentModes: string[] = ['ACH (Automated Clearing House)', 'ECS (Electronic Clearance Service)', 'PDC (Post Dated Check)'];
  interestTypeOptions: string[] = ['Fixed', 'Floating'];
  status: string = 'sanctioned';
  // Hold : string = ''; 
  requestedAmount: boolean = false;
  applicantStatus = false;
  // Define Status options
  // statusOptions: string[] = ['sanctioned', 'Hold'];
  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.initializeForm();
    console.log('Customer ID:', this.customerId);
    const today = new Date();
    const formattedToday = today.toISOString().split('T')[0];   // Extract the date part (YYYY-MM-DD)
    this.loanSanctionForm.patchValue({
      loanRequested: this.LoanAmount ? this.formatIndianCurrency(this.LoanAmount) : '',
      repaymentMode: this.RepaymentMode || '',
      emiStartDate: formattedToday,  // Set today's date in ISO format
    })
    // this.getdynamicdata();
    this.calculateOriginationFee();
  }

  formatIndianCurrency(value: any): string {
    if (!value) return '';
    return Number(value).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  updateLoanRequested(event: any): void {
    let rawValue = event.target.value.replace(/,/g, ''); // Remove commas
    this.loanSanctionForm.get('loanRequested')?.setValue(rawValue);
  }

  private initializeForm(): void {
    this.loanSanctionForm = this.fb.group({
      // loanAccountNumber: ['', Validators.required],
      loanAccountNumber: ['',[Validators.required, Validators.pattern('^[a-zA-Z0-9]+$')]],
      loanRequested: ['', [Validators.required, Validators.pattern("^[0-9,]+(\\.[0-9]{1,2})?$"), Validators.min(1)]],
      originationFee: ['', [Validators.required]],
      returnOriginationFee: ['', [Validators.required]],
      amountSanctioned: ['', [Validators.required, Validators.pattern("^[0-9,]+$"), Validators.min(1)]],
      processingCharge: ['', [Validators.required, Validators.pattern("^[0-9]+$"), Validators.min(1)]],
      documentCharge: ['', [Validators.required, Validators.pattern("^[0-9]+$"), Validators.min(1)]],
      rateOfInterest: ['', [Validators.required, Validators.pattern("^[0-9]+$"), Validators.min(1)]],
      numberOfEmis: ['', Validators.required],
      emiStartDate: ['', Validators.required],
      emiEndDate: ['', Validators.required],
      dueDate: ['', [Validators.required, Validators.pattern("^(3[01]|[12][0-9]|[1-9])$")]],
      interestType: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
      emiAmount: ['', [Validators.required, Validators.pattern("^[0-9,]+(\\.[0-9]{1,2})?$"), Validators.min(1)]],
      repaymentMode: ['', [Validators.required, Validators.pattern('^[a-zA-Z ()]*$')]],
      // status: ['', Validators.required],
      // hold: [''] 
    });

    // this.loanSanctionForm.get('status')?.valueChanges.subscribe(value => {
    //   if (value === 'Hold') {
    //     this.loanSanctionForm.get('hold')?.setValidators([Validators.required]);
    //   } else {
    //     this.loanSanctionForm.get('hold')?.clearValidators();
    //   }
    //   this.loanSanctionForm.get('hold')?.updateValueAndValidity();
    // });
  }

  // onStatusChange(event: Event) {
  //   const selectedValue = (event.target as HTMLSelectElement).value; // Explicitly cast event.target
  //   if (selectedValue === 'Hold') {
  //     this.applicantStatus = true;  // Show remarks field
  //   } else {
  //     this.applicantStatus = false; // Hide remarks field
  //   }
  // }

  formatAmountSanctioned(fieldName: string) {
    let value = this.loanSanctionForm.get(fieldName)?.value;

    // Remove non-numeric characters
    value = value.replace(/[^0-9]/g, '');

    // Convert to number and format with commas
    if (value) {
      value = parseInt(value, 10).toLocaleString('en-IN'); // Indian number format
      this.loanSanctionForm.patchValue({ [fieldName]: value }, { emitEvent: false });
    }
  }

  calculateOriginationFee() {

    const requestedRaw = this.LoanAmount?.toString().replace(/,/g, '');
    const sanctionedRaw = this.loanSanctionForm.get('amountSanctioned')?.value?.toString().replace(/,/g, '');

    const requested = parseFloat(requestedRaw);
    const sanctioned = parseFloat(sanctionedRaw);

    const originationOnRequested = requested * 0.01;

    if (!isNaN(sanctioned) && sanctioned > 0) {

      // Check if sanctioned > requested - INVALID
      if (sanctioned > requested) {
        this.loanSanctionForm.patchValue({
          amountSanctioned: '', // ❗ Clear the input field
          originationFee : '',
          returnOriginationFee : ''
        });

        // Optional: Show alert or error message to user
        this.toast.error({ detail: 'Error', summary: 'Sanctioned amount cannot be greater than requested amount.', duration: 3000 });
        return; // Exit the function
      }

      const originationOnSanctioned = sanctioned * 0.01;
      const returnOrigination = originationOnRequested - originationOnSanctioned;

      this.loanSanctionForm.patchValue({
        originationFee: this.formatIndianCurrency(originationOnSanctioned),
        returnOriginationFee: returnOrigination > 0 ? this.formatIndianCurrency(returnOrigination) : '0'
      });
      // alert(this.loanSanctionForm.value.originationFee.replace(/,/g, ''));
      // alert(this.loanSanctionForm.value.returnOriginationFee.replace(/,/g, ''));
    } else {
      this.loanSanctionForm.patchValue({
        originationFee: this.formatIndianCurrency(originationOnRequested),
        returnOriginationFee: '0'
      });
    }
  }

  onAmountSanctionedChange() {
    this.formatAmountSanctioned('amountSanctioned');
    this.calculateOriginationFee();
  }
  getUserId() {
    return localStorage.getItem("userId");
  }

  addTimeToDate(date: string): string {
    const dateWithTime = new Date(date);  // Create a Date object with the date part (YYYY-MM-DD)
    dateWithTime.setHours(0, 0, 0, 0);  // Set time to midnight (00:00:00)
    return dateWithTime.toISOString();  // Return full date in ISO format (YYYY-MM-DDTHH:MM:SSZ)
  }
  getdynamicdata() {
    if (
      this.loanSanctionForm.value.rateOfInterest !== null && this.loanSanctionForm.value.rateOfInterest !== '' &&
      this.loanSanctionForm.value.amountSanctioned !== null && this.loanSanctionForm.value.amountSanctioned !== '' &&
      this.loanSanctionForm.value.numberOfEmis !== null && this.loanSanctionForm.value.numberOfEmis !== '' &&
      this.loanSanctionForm.value.interestType !== null && this.loanSanctionForm.value.interestType !== ''
    ) {
      const fundsObj = {
        annualInterestRate: this.loanSanctionForm.value.rateOfInterest,
        loanAmount: this.loanSanctionForm.value.amountSanctioned.replace(/,/g, ''),
        installmentTenor: this.loanSanctionForm.value.numberOfEmis,
        startDate: this.addTimeToDate(this.loanSanctionForm.value.emiStartDate)
      };

      if (this.loanSanctionForm.value.interestType.toLowerCase() === 'floating') {
        this.sanctionService.floatingBasedData(fundsObj).subscribe({
          next: (response: any) => {
            if (response.emiDates) {
              this.loanSanctionForm.patchValue({
                emiEndDate: response.emiDates.emiEndDate,
                dueDate: response.emiDates.monthlyDueDate,
                emiAmount: response.repaymentSchedules[0].installment
                  ? this.formatIndianCurrency(response.repaymentSchedules[0].installment)
                  : '',
              });
            }
          },
          error: () => {
            // handle error
          }
        });
      } else if (this.loanSanctionForm.value.interestType.toLowerCase() === 'fixed') {
        this.sanctionService.fixedBasedData(fundsObj).subscribe({
          next: (response: any) => {
            if (response.emiDates) {
              this.loanSanctionForm.patchValue({
                emiEndDate: response.emiDates.emiEndDate,
                dueDate: response.emiDates.monthlyDueDate,
                emiAmount: response.repaymentSchedules[0].installment
                  ? this.formatIndianCurrency(response.repaymentSchedules[0].installment)
                  : '',
              });
            }
          },
          error: () => {
            // handle error
          }
        });
      }
    }
  }

  sendData() {
    // // Remove commas and convert to a number
    // let cleanedLoanRequested = Number(this.loanSanctionForm.value.loanRequested.replace(/,/g, ''));
    // let cleanedEmiAmount = Number(this.loanSanctionForm.value.emiAmount.replace(/,/g, ''));
    // // Patch the cleaned value back into the form
    // this.loanSanctionForm.patchValue({
    //    loanRequested: cleanedLoanRequested ,
    //    emiAmount: cleanedEmiAmount
    //   });

    if (this.loanSanctionForm.valid) {
      // const status = this.loanSanctionForm.value.status;
      const sanctionObj: any = {
        // loanSanctionId: this.loanSanctionForm.value.loanSanctionId,
        loanAccountNumber: this.loanSanctionForm.value.loanAccountNumber,
        loanRequested: this.loanSanctionForm.value.loanRequested.replace(/,/g, ''),
        amountSanctioned: this.loanSanctionForm.value.amountSanctioned.replace(/,/g, ''),
        originationFee: this.loanSanctionForm.value.originationFee.replace(/,/g, ''),
        returnOriginationFee: this.loanSanctionForm.value.returnOriginationFee.replace(/,/g, ''),
        // amountDisbursed: this.loanSanctionForm.value.amountDisbursed,
        rateOfInterest: this.loanSanctionForm.value.rateOfInterest,
        numberOfEmis: this.loanSanctionForm.value.numberOfEmis,
        emiStartDate: this.loanSanctionForm.value.emiStartDate,
        emiEndDate: this.loanSanctionForm.value.emiEndDate,
        dueDate: this.loanSanctionForm.value.dueDate,
        interestType: this.loanSanctionForm.value.interestType,
        emiAmount: this.loanSanctionForm.value.emiAmount.replace(/,/g, ''),
        repaymentMode: this.loanSanctionForm.value.repaymentMode,
        // status: status,
        status: this.status,
        loanProcessingCharges: this.loanSanctionForm.value.processingCharge, // Added processingCharge
        documentationCharges: this.loanSanctionForm.value.documentCharge, // Added documentCharge
        addedBy: this.getUserId(),
        // updatedBy: this.loanSanctionForm.value.updatedBy,
        loanId: this.LoanId,
        hold: this.loanSanctionForm.value.hold, // Automatically included
      };

      this.sanctionService.postSanctionInfo(sanctionObj).subscribe({
        next: (response: any) => {
          if (response.status === "success") {
            console.log('sanction data added successfully:', response);
            this.toast.success({ detail: 'Success', summary: 'successfully loan sanctioned', duration: 3000 });
            this.close();
          } else {
            this.toast.error({ detail: 'Error', summary: 'Loan sanction failed', duration: 3000 });
          }
        },
        error: (err) => {
          console.error('Error sanctioning loan:', err);
          this.toast.error({ detail: 'Error', summary: 'An error occurred while sanctioning the loan', duration: 3000 });
        }
      });
    } else {
      console.log('Form is not valid. Please correct the errors.');
      this.toast.error({
        detail: 'Error',
        summary: 'Form is not valid. Please correct the errors.',
        duration: 3000,
      });
      this.markAllFieldsTouched();
    }
  }
  markAllFieldsTouched(): void {
    Object.keys(this.loanSanctionForm.controls).forEach((key) => {
      const control = this.loanSanctionForm.get(key);
      control?.markAsTouched();
      control?.updateValueAndValidity();
    });
  }
  close(): void {
    this.closeModal.emit();
  }
}

