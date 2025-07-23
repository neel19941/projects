import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbCalendar, NgbDateStruct, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { PrivilegesService } from 'src/app/services/privileges.service';
import { LoanSanctionService } from 'src/app/services/loan-sanction.service';
import { PaymentsService } from 'src/app/services/payments.service';
import { CapitalizePipe } from 'src/app/core/pipes/capitalize.pipe';
import { DetailedEmiInfoComponent } from '../detailed-emi-info/detailed-emi-info.component';
import { PaymentsEditComponent } from '../../payments-edit/payments-edit.component';
import { ReceivableConfirmationComponent } from '../receivable-confirmation/receivable-confirmation.component';

@Component({
  selector: 'app-member-report',
  standalone: true,
  imports: [CommonModule, FormsModule, CapitalizePipe, ReactiveFormsModule, DetailedEmiInfoComponent, PaymentsEditComponent, NgbModule, ReceivableConfirmationComponent],
  templateUrl: './member-report.component.html',
  styleUrls: ['./member-report.component.scss']
})
export class MemberReportComponent {

  @ViewChild('printSection') printSection!: ElementRef;
  summaryDetails: any;

  searchTerm: string = '';
  isDropdownOpen: boolean = false;

  transactions: any[] = [];
  memberDetails: any;
  dueDetails: any[] = [];

  today: Date = new Date();

  disbursementDetails: any;
  referencesDetails : any;
  receivablesList: any[] = [];
  filteredList: any[] = [];

  disbursedId: any;
  itemObj!: any;

  protected privilegeServ = inject(PrivilegesService);
  private sanctionService = inject(LoanSanctionService);
  private paymentsService = inject(PaymentsService);
  private toast = inject(CustomToastService);

  constructor() { }

  ngOnInit() {
    this.fetchReceivables();
  }

  fetchReceivables() {
    this.sanctionService.getDisbursedCustomerDetails().subscribe({
      next: (response: any) => {
        if (response.status === 'success' && response.data) {
          this.receivablesList = response.data;
          this.filteredList = [...this.receivablesList];
        }
      },
      error: (err) => console.error('Error fetching receivables:', err)
    });
  }

  onSearchChange() {
    if (this.searchTerm) {
      this.filteredList = this.receivablesList.filter(item =>
        item.firstName?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        (item.loanAccountNumber?.toLowerCase().includes(this.searchTerm.toLowerCase())) ||
        item.mobileNumber?.includes(this.searchTerm)
      );
    } else {
      this.filteredList = [...this.receivablesList];
    }
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

formatIndianCurrency(value: any): string {
  if (value === undefined) return '';
  
  const numericValue = Number(value);
  return new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(isNaN(numericValue) ? 0 : numericValue);
}

  selectItem(item: any) {
    this.itemObj = item;
    this.disbursedId = item.disbursmentId;

    this.paymentsService.getTransactionsMemberReports(this.disbursedId).subscribe({
      next: (response: any) => {
        if (response.status === 'success' && response.data) {
          this.memberDetails = response.data.memberDetails;
          this.transactions = response.data.memberReports;
          this.summaryDetails = response.data.summaryDetails; // <-- Add this line
          this.disbursementDetails = response.data.disbursedDetails;
           this.referencesDetails = response.data.referencesDetails;
                  // ✅ Assign dueDetails from nested structure
        this.dueDetails = response.data?.dueDetails?.dueDetails || [];

          this.toast.success({
            detail: 'Success',
            summary: 'Details fetched successfully.',
            duration: 3000
          });
        }
      },
      error: (err) => {
        console.error('Error fetching transactions:', err);
        this.toast.error({
          detail: 'Error',
          summary: 'Failed to fetch details.',
          duration: 3000
        });
      }
    });

    this.searchTerm = item.fullName + (item.loanAccountNumber ? ` - ${item.loanAccountNumber}` : '');
    this.isDropdownOpen = false;
  }

  printReport() {
    const printContents = this.printSection.nativeElement.innerHTML;
    const popupWin = window.open('', '_blank', 'width=1000,height=900,top=50,left=100');

    if (popupWin) {
      popupWin.document.open();
      popupWin.document.write(`
    <html>
      <head>
        <title>Member Report</title>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css">
        <style>
          * {
            box-sizing: border-box;
          }

          body {
            padding: 20px;
            font-family: Arial, sans-serif;
            color: #000;
            margin: 0;
            overflow: visible !important;
          }

          .table th,
          .table td {
            page-break-inside: avoid !important;
            -webkit-print-color-adjust: exact;
          }

          .table thead th {
            background-color: #f1f1f1 !important;
            color: #000;
          }

          @media print {
            html, body {
              height: auto !important;
              overflow: visible !important;
            }

            .no-print {
              display: none;
            }

            .table-responsive {
              overflow: visible !important;
            }

            .table {
              width: 100% !important;
            }
          }
        </style>
      </head>
      <body onload="window.print(); window.close()">
        ${this.printSection.nativeElement.innerHTML}
      </body>
    </html>
  `);
      popupWin.document.close();
    }

  }

}


//  transactions = [
//     {
//       createdDate: '2025-07-01',
//       updatedDate: '2025-07-02',
//       amountPaid: 1200.0,
//       chequeReturnCharges: 0,
//       description: 'Monthly EMI Payment',
//       interestComponent: 200,
//       latePenalty: 50,
//       otherCharges: 100,
//       otherChargesType: 'Legal Charge',
//       paymentDate: '2025-07-01',
//       paymentMode: 'Bank Transfer',
//       penaltyComponent: 30,
//       principalComponent: 820,
//       repaymentId: 'RPT-1001'
//     },
// {
//   createdDate: '2025-06-01',
//   updatedDate: '2025-06-03',
//   amountPaid: 1500.0,
//   chequeReturnCharges: 100,
//   description: 'Delayed Payment',
//   interestComponent: 300,
//   latePenalty: 75,
//   otherCharges: 50,
//   otherChargesType: 'Penal Charge',
//   paymentDate: '2025-06-01',
//   paymentMode: 'Cheque',
//   penaltyComponent: 25,
//   principalComponent: 950,
//   repaymentId: 'RPT-1000'
// },
//     {
//   createdDate: '2025-06-01',
//   updatedDate: '2025-06-03',
//   amountPaid: 1500.0,
//   chequeReturnCharges: 100,
//   description: 'Delayed Payment',
//   interestComponent: 300,
//   latePenalty: 75,
//   otherCharges: 50,
//   otherChargesType: 'Penal Charge',
//   paymentDate: '2025-06-01',
//   paymentMode: 'Cheque',
//   penaltyComponent: 25,
//   principalComponent: 950,
//   repaymentId: 'RPT-1000'
// }
// ];

// today: Date = new Date();

// searchTerm: string = '';
// isDropdownOpen: boolean = false;
// protected privilegeServ = inject(PrivilegesService);
// private sanctionService = inject(LoanSanctionService);
// private paymentsService = inject(PaymentsService);

// paymentForm!: FormGroup;
// receivablesList: any[] = [];
// filteredList: any[] = [];

// disbursedId: any;

// showEmiDetailedInfoComponent = false;
// action: string = '';
// paymentId!: number;
// itemObj!: any;


  
  // formatIndianCurrency(value: any): string {
  //   if (!value) return '';
  //   return new Intl.NumberFormat('en-IN', {
  //     minimumFractionDigits: 2,
  //     maximumFractionDigits: 2
  //   }).format(Number(value));
  // }

  // formatIndianCurrency(value: any): string {
  //   if (value === null || value === undefined) return '';
  //   return new Intl.NumberFormat('en-IN', {
  //     minimumFractionDigits: 2,
  //     maximumFractionDigits: 2
  //   }).format(Number(value));
  // }

// private toast = inject(CustomToastService);
// constructor(private fb: FormBuilder) { }

// ngOnInit() {
//   this.fetchReceivables();
//   this.paymentForm = this.fb.group({
//     transactionId: ['', Validators.required],
//     amountPaid: ['', [Validators.required, Validators.pattern("^[0-9,]+(\\.[0-9]{1,2})?$")]],
//     otherCharges: ['', [Validators.pattern("^[0-9,]+(\\.[0-9]{1,2})?$")]],
//     receiptDate: ['', Validators.required],
//     paymentMode: ['', Validators.required],
//     otherChargesType: [''],
//     description: ['', Validators.required]
//   });
// }

// fetchReceivables() {
//   this.sanctionService.getDisbursedCustomerDetails().subscribe(
//     (response: any) => {
//       if (response.status === 'success' && response.data) {
//         this.receivablesList = response.data;
//         this.filteredList = [...this.receivablesList];
//       }
//     },
//     (error) => {
//       console.error('Error fetching receivables:', error);
//     }
//   );
// }

// formatIndianCurrency(value: any): string {
//   if (!value) return '';
//   return new Intl.NumberFormat('en-IN', {
//     minimumFractionDigits: 2,
//     maximumFractionDigits: 2
//   }).format(Number(value));
// }

// formatAmountSanctioned(fieldName: string) {
//   let value = this.paymentForm.get(fieldName)?.value;
//   value = value.replace(/[^0-9]/g, '');
//   if (value) {
//     value = parseInt(value, 10).toLocaleString('en-IN');
//     this.paymentForm.patchValue({ [fieldName]: value }, { emitEvent: false });
//   }
// }

// onSearchChange() {
//   if (this.searchTerm) {
//     this.filteredList = this.receivablesList.filter(item =>
//       item.firstName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
//       (item.loanAccountNumber && item.loanAccountNumber.toLowerCase().includes(this.searchTerm.toLowerCase())) ||
//       item.mobileNumber.includes(this.searchTerm)
//     );
//   } else {
//     this.filteredList = [...this.receivablesList];
//   }
// }

// toggleDropdown() {
//   this.isDropdownOpen = !this.isDropdownOpen;
// }

//   selectItem(item: any) {
//   this.itemObj = item;

//   this.disbursedId = item.disbursmentId;

//   this.paymentsService.getTransactionsMemberReports(item.disbursmentId).subscribe({
//     next: (response: any) => {
//       if (response.status === 'success' && response.data) {

//         this.toast.success({
//           detail: 'Success',
//           summary: 'Details Fetched successfully.',
//           duration: 3000
//         });
//         this.paymentForm.reset();
//       }
//     },
//     error: (error) => {
//       console.error('Error fetching EMI Info:', error);

//       this.toast.error({
//         detail: 'Error',
//         summary: 'Failed to get Details.',
//         duration: 3000
//       });
//     }
//   });
//   this.searchTerm = item.fullName + (item.loanAccountNumber ? ` - ${item.loanAccountNumber}` : '');
//   this.isDropdownOpen = false;
// }