import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgToastService } from 'ng-angular-popup';
import { LoanSanctionService } from 'src/app/services/loan-sanction.service';
import { PaymentsService } from 'src/app/services/payments.service';
import { CapitalizePipe } from 'src/app/core/pipes/capitalize.pipe';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';

@Component({
  selector: 'app-payment-transaction',
  standalone: true,
  imports: [CommonModule, CapitalizePipe],
  templateUrl: './payment-transaction.component.html',
  styleUrls: ['./payment-transaction.component.scss']
})
export class PaymentTransactionComponent {
  @Input() selectedDisId!: string;
  @Output() closeModal: EventEmitter<void> = new EventEmitter();
  pageIndex = 0;
  pageSize = 50; // Items per page
  field = 'empty';
  sortField = 'amountStatus';
  sortOrder: 'asc' | 'desc' = 'desc'; // Default sort order
  hoverField: string | null = null;
  currentPageIndex = 0;
  totalItems: number = 0;
  totalPages: number = 0;
  action: string = '';
  paymentId!: number;
  loanamount: string = '';
  repaymentmode: string = '';
  applicationsInfo: any[] = [];
  showApplicationModal = false;
  selectedApplicationId: string = '';
  confirmMessage: string = '';
  showConfirmDialog = false;
  // showAddApplication = false;
  showPaymentEditComponent = false;
  showSanctionComponent = false;
  // private sanctionService = inject(LoanSanctionService);
  private paymentsService = inject(PaymentsService);
  constructor(private toast: CustomToastService) { }

  ngOnInit(): void {
    this.getApplications();
    // this.setManualData();
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
  
  // onSort(field: string): void {
  //   if (this.sortField === field) {
  //     this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
  //   } else {
  //     this.sortField = field;
  //     this.sortOrder = 'asc';
  //   }
  //   this.getApplications();
  // }

  getSortIcon(field: string): string {
    if (this.sortField === field) {
      return this.sortOrder === 'asc' ? 'bi bi-arrow-down' : 'bi bi-arrow-up';
    }
    return this.hoverField === field ? 'bi bi-arrow-up' : '';
  }

  // formatIndianCurrency(value: any): string {
  //   if (!value) return '';
  //   return new Intl.NumberFormat('en-IN', { 
  //     minimumFractionDigits: 2, 
  //     maximumFractionDigits: 2 
  //   }).format(Number(value));
  // }

  formatIndianCurrency(value: any): string {
    if (value === null || value === undefined) return '';
    return new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(Number(value));
  }


  // onSearch(event: any): void {
  //   const keyword = event.target.value.trim();
  //   this.field = keyword;
  //   this.currentPageIndex = 0;
  //   if (keyword !== '') {
  //     const requestPayload = {
  //       pageNumber: 1,
  //       pageSize: this.pageSize,
  //       sortField: this.sortField,
  //       sortOrder: this.sortOrder,
  //       keyword: keyword,
  //     };

  //     this.sanctionService.getDisbursedFindById(requestPayload).subscribe(
  //       (response: any) => {
  //         if (response && response.data && Array.isArray(response.data.content)) {
  //           this.applicationsInfo = response.data.content;
  //           this.totalItems = response.data.totalElements;
  //           this.totalPages = Math.ceil(this.totalItems / this.pageSize);
  //         } else {
  //           this.applicationsInfo = [];
  //           this.totalItems = 0;
  //           this.totalPages = 1;
  //         }
  //       },
  //       error => {
  //         console.error('Error fetching applications:', error);
  //         this.applicationsInfo = [];
  //         this.totalItems = 0;
  //         this.totalPages = 1;
  //       }
  //     );

  //   } else {
  //     this.getApplications(this.currentPageIndex + 1);
  //   }
  // }

  getApplications(pageIndex = 1): void {
    // const requestPayload = {
    //   pageNumber: pageIndex,
    //   pageSize: this.pageSize,
    //   sortOrder: this.sortOrder,
    //   sortField: this.sortField,
    //   keyword: this.field
    // };

    this.paymentsService.getPaymentStatements(this.selectedDisId).subscribe({
      next: (response: any) => {
        if (Array.isArray(response)) {
          // Directly assign the array since response itself is an array
          this.applicationsInfo = response;
        } else if (response && response.data && Array.isArray(response.data.content)) {
          // If API response changes later to nested structure, keep this check
          this.applicationsInfo = response.data.content;
        } else {
          this.applicationsInfo = [];
          // this.totalItems = 0;
          // this.totalPages = 1;
        }
      },
      error: (error) => {
        console.error('Error fetching applications:', error);
        // this.applicationsInfo = [];
        // this.totalItems = 0;
        // this.totalPages = 1;
      }
    });
  }
  // Function to set manual data

  // generateSerialNumber(index: number): number {
  //   return this.currentPageIndex * this.pageSize + index + 1;
  // }

  // goToFirstPage(): void {
  //   if (this.currentPageIndex > 0) {
  //     this.currentPageIndex = 0;
  //     this.getApplications(this.currentPageIndex + 1);
  //   }
  // }

  // goToPreviousPage(): void {
  //   if (this.currentPageIndex > 0) {
  //     this.currentPageIndex--;
  //     this.getApplications(this.currentPageIndex + 1);
  //   }
  // }

  // goToNextPage(): void {
  //   if (this.currentPageIndex < this.totalPages - 1) {
  //     this.currentPageIndex++;
  //     this.getApplications(this.currentPageIndex + 1);
  //   }
  // }

  // goToLastPage(): void {
  //   if (this.currentPageIndex < this.totalPages - 1) {
  //     this.currentPageIndex = this.totalPages - 1;
  //     this.getApplications(this.currentPageIndex + 1);
  //   }
  // }

  closeReviewPopup() {
    this.showPaymentEditComponent = false;
    // this.getApplications();
  }
  // Function to set manual data
  // setManualData(): void {
  //   this.applicationsInfo = [
  //     {
  //       paymentId: 1,
  //       dueDate: "2025-03-10",
  //       dueAmount: 50000,
  //       amountPaid: "0",
  //       amountStatus: "paid",
  //       firstName: "NagaSri",
  //       mobileNumber: "7894561236",
  //       applicationReferenceId: "BEACON0009"
  //     },
  //     {
  //       paymentId: 2,
  //       dueDate: "2025-03-10",
  //       dueAmount: 50000,
  //       amountPaid: "0",
  //       amountStatus: "unpaid",
  //       firstName: "NagaSri",
  //       mobileNumber: "7894561236",
  //       applicationReferenceId: "BEACON0009"
  //     }
  //   ];
  // }
  close(): void {
    this.closeModal.emit();
  }
}
