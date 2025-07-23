import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { LoanSanctionService } from 'src/app/services/loan-sanction.service';
import { PaymentsService } from 'src/app/services/payments.service';
import { PaymentsEditComponent } from '../payments-edit/payments-edit.component';
import { PrivilegesService } from 'src/app/services/privileges.service';
import { CapitalizePipe } from 'src/app/core/pipes/capitalize.pipe';
import { NgbCalendar, NgbDateStruct, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DetailedEmiInfoComponent } from './detailed-emi-info/detailed-emi-info.component';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';
import { ReceivableConfirmationComponent } from './receivable-confirmation/receivable-confirmation.component';

@Component({
  selector: 'app-receivables',
  standalone: true,
  imports: [CommonModule, FormsModule, CapitalizePipe, ReactiveFormsModule, DetailedEmiInfoComponent, PaymentsEditComponent, NgbModule, ReceivableConfirmationComponent],
  templateUrl: './receivables.component.html',
  styleUrls: ['./receivables.component.scss']
})

export class ReceivablesComponent {

  fromDate!: NgbDateStruct;
  toDate!: NgbDateStruct;
  minDate!: NgbDateStruct;
  maxDate!: NgbDateStruct;

  searchTerm: string = '';
  isDropdownOpen: boolean = false;
  protected privilegeServ = inject(PrivilegesService);
  private sanctionService = inject(LoanSanctionService);
  private paymentsService = inject(PaymentsService);

  paymentForm!: FormGroup;
  receivablesList: any[] = [];
  filteredList: any[] = [];

  EmiData: {
    loanAmount: number;
    outstanding: number;
    principal: number;
    interest: number;
    numberOfEmisDue: number;
    repaid: number;
    dueDate: string;
    lastPaydate : string;
    emiDueAmount: number;
    totalDue: number;
    totalPenalty: number;
    emiDueInfo: {
      emiNumber: number;
      dueDate: string;
      dueDays: number;
      dueAmount: number;
      penalty: number;
      emiMonth: string;
    }[];
  } | null = null;

  loanAccNumber: any;
  showConfirmDialog = false;
  confirmMessage: string = '';
  sharedReceivedAmount : any;
  disbursedId: any;
  emiDueDetails: any[] = [];
  hoverField: string | null = null;
  showEmiDetailedInfoComponent = false;
  action: string = '';
  paymentId!: number;
  itemObj!: any;

  showPaymentEditComponent = false;
  private calendar = inject(NgbCalendar);
  private toast = inject(CustomToastService);
  constructor(private fb: FormBuilder) { }


  ngOnInit() {
    this.fetchReceivables();
    this.paymentForm = this.fb.group({
      // transactionId: ['', Validators.required], // <-- Newly added field
      // loanAccount: ['', Validators.required],
      // loanAmount: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      // totalOutstanding: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      // receiptDate: ['', Validators.required],
      // receivableAmount: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      // amountPaid: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      transactionId: ['', Validators.required],
      // receiptDate: ['', Validators.required],
      // amountPaid: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      // amountPaid: ['', [Validators.required, Validators.pattern("^[0-9,]+(\\.[0-9]{1,2})?$")]],
      // amountPaid: ['', [Validators.required, Validators.pattern("^[0-9,]+(\\.[0-9]{1,2})?$")]],
      
     amountPaid: ['', [Validators.required]],
      
      // amountPaid: ['',[Validators.required,Validators.pattern(/^\d{1,9}(?:\.\d{1,2})?$/),Validators.max(10000000)]],
      otherCharges: ['', [Validators.pattern("^[0-9,]+(\\.[0-9]{1,2})?$")]],
      receiptDate: ['', Validators.required],
      // amountPaid: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      //  amountPaid: ['', [Validators.required, Validators.pattern("^[0-9,]+(\\.[0-9]{1,2})?$")]],
      paymentMode: ['', Validators.required],
      otherChargesType: [''],
      // referenceNumber: ['', Validators.required],
      description: ['', Validators.required] // optional
    }, { validators: otherChargesValidator });
    // this.paymentForm.patchValue({
    //   amountPaid: this.amountPaid ? this.formatIndianCurrency(this.amountPaid) : '',
    //   repaymentMode: this.RepaymentMode || '',
    //   emiStartDate: formattedToday,  // Set today's date in ISO format
    // })
    // const today = this.calendar.getToday();
    // this.minDate = { year: 2000, month: 1, day: 1 };
    // this.maxDate = today;

    // const today = this.calendar.getToday(); // Today's date
    // const sevenDaysAgo = new Date();
    // sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6); // Including today makes it 7 days

    // Convert JavaScript Date to NgbDateStruct
    // this.minDate = {
    //   year: sevenDaysAgo.getFullYear(),
    //   month: sevenDaysAgo.getMonth() + 1,
    //   day: sevenDaysAgo.getDate()
    // };

    // this.maxDate = today;
  }

  onReceiptDateChange(): void {
    const date = this.paymentForm.get('receiptDate')?.value;
    if (date) {
      const formatted = `${date.year}-${date.month.toString().padStart(2, '0')}-${date.day.toString().padStart(2, '0')}`;

      this.paymentsService.getEmiInfoByDate(this.disbursedId, formatted).subscribe({
        next: (response: any) => {
          if (response.status === 'success' && response.data) {
            this.EmiData = response.data; // full EMI object
            this.emiDueDetails = response.data.emiDueInfo || []; // 👈 update emiDueDetails array here

            this.toast.success({
              detail: 'Success',
              summary: 'Details Fetched successfully.',
              duration: 3000
            });
          }
        },
        error: (error) => {
          console.error('Error fetching EMI Info:', error);
          this.EmiData = null;
          this.emiDueDetails = []; // clear EMI due info on error

          this.toast.error({
            detail: 'Error',
            summary: 'Failed to get Details.',
            duration: 3000
          });
        }
      });
    }
  }

  fetchReceivables() {
    this.sanctionService.getDisbursedCustomerDetails().subscribe(
      (response: any) => {
        if (response.status === 'success' && response.data) {
          this.receivablesList = response.data;
          this.filteredList = [...this.receivablesList];
        }
      },
      (error) => {
        console.error('Error fetching receivables:', error);
      }
    );
  }

  formatIndianCurrency(value: any): string {
    if (!value) return '';
    // Convert number to string and format it in the Indian number system
    return new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(Number(value));
  }

  // formatAmountSanctioned(fieldName: string) {
  //   let value = this.paymentForm.get(fieldName)?.value;

  //   // Remove non-numeric characters
  //   value = value.replace(/[^0-9]/g, '');

  //   // Convert to number and format with commas
  //   if (value) {
  //     value = parseInt(value, 10).toLocaleString('en-IN'); // Indian number format
  //     this.paymentForm.patchValue({ [fieldName]: value }, { emitEvent: false });
  //   }
  // }

// formatAmountSanctioned(fieldName: string) {
//   const control = this.paymentForm.get(fieldName);
//   let value = control?.value || '';

//   // Remove all non-numeric characters (like commas)
//   const rawValue = value.replace(/[^0-9]/g, '');

//   if (rawValue) {
//     const numericValue = parseInt(rawValue, 10);

//     // Format the number with commas (Indian format)
//     const formattedValue = numericValue.toLocaleString('en-IN');
//     control?.setValue(formattedValue, { emitEvent: false });

//     // Check if value is greater than 1 crore
//     if (numericValue > 10000000) {
//       control?.setErrors({ max: true });
//     } else {
//       // If previously had max error, remove it
//       if (control?.hasError('max')) {
//         const currentErrors = control.errors;
//         delete currentErrors?.['max'];
//         if (Object.keys(currentErrors || {}).length === 0) {
//           control.setErrors(null);
//         } else {
//           control.setErrors(currentErrors);
//         }
//       }
//     }
//   } else {
//     control?.setValue('', { emitEvent: false });
//   }
// }

formatAmountSanctioned(fieldName: string) {
  const control = this.paymentForm.get(fieldName);
  let value = control?.value || '';

  // Remove all non-numeric characters (like commas)
  const rawValue = value.replace(/[^0-9]/g, '');

  if (rawValue) {
    const numericValue = parseInt(rawValue, 10);

    // Format the number with commas (Indian format)
    const formattedValue = numericValue.toLocaleString('en-IN');
    control?.setValue(formattedValue, { emitEvent: false });

    // Check if value is greater than 1 crore
    if (numericValue > 10000000) {
      control?.setErrors({ ...control.errors, max: true });
    } else {
      // Remove max error if present
      if (control?.hasError('max')) {
        const currentErrors = { ...control.errors };
        delete currentErrors['max'];
        if (Object.keys(currentErrors).length === 0) {
          control.setErrors(null);
        } else {
          control.setErrors(currentErrors);
        }
      }
    }

    control?.markAsTouched();
    control?.markAsDirty();
  } else {
    control?.setValue('', { emitEvent: false });
  }
}

  onSearchChange() {
    if (this.searchTerm) {
      this.filteredList = this.receivablesList.filter(item =>
        item.firstName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        (item.loanAccountNumber && item.loanAccountNumber.toLowerCase().includes(this.searchTerm.toLowerCase())) ||
        item.mobileNumber.includes(this.searchTerm)
      );
    } else {
      this.filteredList = [...this.receivablesList];
    }
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  openPaymentPopup(data: any) {
    this.showPaymentEditComponent = true;
    this.paymentId = data.paymentId;
    this.action = 'update';
  }

  openAddApplication(msg: any) {
    this.action = msg;
    this.showPaymentEditComponent = true;
  }

  closeReviewPopup() {
    this.showPaymentEditComponent = false;
    this.selectItem(this.itemObj);
  }

  openEmiPopup() {
    this.showEmiDetailedInfoComponent = true;
    // this.disbursedId = id;
  }

  closeEmiPopup() {
    this.showEmiDetailedInfoComponent = false;
    // this.selectItem(this.itemObj);
  }

  // selectItem(item: any) {
  //   this.itemObj = item;
  //   this.paymentsService.getPaymentStatements(item.disbursmentId).subscribe({
  //     next: (response: any) => {
  //       if (Array.isArray(response)) {
  //         // Directly assign the array since response itself is an array
  //         this.paymentstatements = response;
  //       } else if (response && response.data && Array.isArray(response.data.content)) {
  //         // If API response changes later to nested structure, keep this check
  //         this.paymentstatements = response.data.content;
  //       } else {
  //         this.paymentstatements = [];
  //         // this.totalItems = 0;
  //         // this.totalPages = 1;
  //       }
  //     },
  //     error: (error) => {
  //       console.error('Error fetching applications:', error);
  //       // this.applicationsInfo = [];
  //       // this.totalItems = 0;
  //       // this.totalPages = 1;
  //     }
  //   });
  //   this.searchTerm = item.firstName + (item.loanAccountNumber ? ` - ${item.loanAccountNumber}` : '');
  //   this.isDropdownOpen = false;
  // }

  selectItem(item: any) {
    this.itemObj = item;
    this.loanAccNumber = item.loanAccountNumber;
    this.disbursedId = item.disbursmentId;

    this.paymentsService.getEmiInfo(item.disbursmentId).subscribe({
      next: (response: any) => {
        if (response.status === 'success' && response.data) {
          this.EmiData = response.data;
          this.emiDueDetails = response.data.emiDueInfo || []; // <-- extract emiDueInfo
          this.toast.success({
            detail: 'Success',
            summary: 'Details Fetched successfully.',
            duration: 3000
          });
          this.paymentForm.reset();
        }
      },
      error: (error) => {
        console.error('Error fetching EMI Info:', error);
        this.EmiData = null;
        this.emiDueDetails = []; // clear on error
        this.toast.error({
          detail: 'Error',
          summary: 'Failed to get Details.',
          duration: 3000
        });
      }
    });
    this.searchTerm = item.fullName + (item.loanAccountNumber ? ` - ${item.loanAccountNumber}` : '');
    this.isDropdownOpen = false;
  }


  // onSubmitPrevious() {
  //   this.openProceedConfirmation();
  //   if (this.paymentForm.valid) {
  //     const date = this.paymentForm.get('receiptDate')?.value;
  //     const formatted = `${date.year}-${date.month.toString().padStart(2, '0')}-${date.day.toString().padStart(2, '0')}`;
  //     const emiObj = {
  //       did: this.disbursedId,
  //       paymentMode: this.paymentForm.value.paymentMode,
  //       otherChargesType: this.paymentForm.value.otherChargesType,
  //       amount: this.paymentForm.value.amountPaid.replace(/,/g, ''),
  //       otherCharges: this.paymentForm.value.otherCharges ? this.paymentForm.value.otherCharges.replace(/,/g, '') : '',
  //       paymentDate: formatted,
  //       transactionId: this.paymentForm.value.transactionId,
  //       // interestAmount: this.paymentForm.value.interestAmount,
  //       // referenceNumber: this.paymentForm.value.referenceNumber,
  //       description: this.paymentForm.value.description,
  //     };

  //     this.paymentsService.postEmiData(emiObj).subscribe({
  //       next: (response: any) => {
  //         if (response.status === "success") {
  //           this.toast.success({
  //             detail: 'Success',
  //             summary: 'Emi Data Saves successfully.',
  //             duration: 3000
  //           });
  //           // Reset the form after success
  //           this.paymentForm.reset();
  //           // this.EmiData = null;
  //           this.selectItem(this.itemObj);
  //         }
  //         else {
  //           this.toast.error({
  //             detail: 'Error',
  //             summary: 'Failed to update Emi Data.' + response.message,
  //             duration: 3000
  //           });
  //         }

  //       },
  //       error: (error) => {
  //         console.error('Error updating payment:', error);
  //         this.toast.error({
  //           detail: 'Error',
  //           summary: 'Failed to update Emi.',
  //           duration: 3000
  //         });
  //       }
  //     });

  //   } else {
  //     this.paymentForm.markAllAsTouched();
  //   }
  // }

  onSubmit() {
    if (this.paymentForm.valid) {
      this.sharedReceivedAmount =  this.paymentForm.value.amountPaid.replace(/,/g, '');
      this.confirmMessage = 'Are you sure you want to proceed?';
      this.showConfirmDialog = true;
    } else {
      this.paymentForm.markAllAsTouched();
    }
  }


  proceedConfirmation(confirmed: boolean): void {
    this.showConfirmDialog = false;


    if (!confirmed) return;

    // Proceed with API call
    const date = this.paymentForm.get('receiptDate')?.value;
    const formatted = `${date.year}-${date.month.toString().padStart(2, '0')}-${date.day.toString().padStart(2, '0')}`;
    const emiObj = {
      did: this.disbursedId,
      paymentMode: this.paymentForm.value.paymentMode,
      otherChargesType: this.paymentForm.value.otherChargesType,
      amount: this.paymentForm.value.amountPaid.replace(/,/g, ''),
      otherCharges: this.paymentForm.value.otherCharges ? this.paymentForm.value.otherCharges.replace(/,/g, '') : '',
      paymentDate: formatted,
      transactionId: this.paymentForm.value.transactionId,
      description: this.paymentForm.value.description
    };

    this.paymentsService.postEmiData(emiObj).subscribe({
      next: (response: any) => {
        if (response.status === "success") {
          this.toast.success({
            detail: 'Success',
            summary: 'EMI Data saved successfully.',
            duration: 3000
          });
          this.paymentForm.reset();
          this.selectItem(this.itemObj);
        } else {
          this.toast.error({
            detail: 'Error',
            summary: 'Failed to update EMI Data. ' + response.message,
            duration: 3000
          });
        }
      },
      error: () => {
        this.toast.error({
          detail: 'Error',
          summary: 'Failed to update EMI.',
          duration: 3000
        });
      }
    });
  }
}
export const otherChargesValidator: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
  const type = group.get('otherChargesType')?.value;
  const amount = group.get('otherCharges')?.value;

  const typeEmpty = !type || type.trim() === '';
  const amountEmpty = !amount || amount.trim() === '';

  if ((typeEmpty && amountEmpty) || (!typeEmpty && !amountEmpty)) {
    return null; // ✅ valid in both cases
  }

  return { otherChargesMismatch: true }; // ❌ invalid
};


// receivablesList = [
//   { mobileNumber: "7894561237", firstName: "Ramya", disbursmentId: 1, loanAccountNumber: "BL789456123" },
//   { mobileNumber: "9089089876", firstName: "Keerthi", disbursmentId: 2, loanAccountNumber: "CL785656123" },
//   { mobileNumber: "7894561236", firstName: "Anshika", disbursmentId: 6, loanAccountNumber: null },
//   { mobileNumber: "9567654890", firstName: "Sabida", disbursmentId: 7, loanAccountNumber: "SA776575983" },
//   { mobileNumber: "98989898", firstName: "Praneeth", disbursmentId: 10, loanAccountNumber: null }
// ];