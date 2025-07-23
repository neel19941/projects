import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReviewComponent } from '../applications-list/review/review.component';
import { CapitalizePipe } from 'src/app/core/pipes/capitalize.pipe';
import { SanctionApplicationComponent } from '../sanction-application/sanction-application.component';
import { ApplicationsService } from 'src/app/services/applications.service';
import { NgToastService } from 'ng-angular-popup';
import { PaymentsService } from 'src/app/services/payments.service';
import { PaymentsEditComponent } from './payments-edit/payments-edit.component';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';

@Component({
  selector: 'app-payment-applications',    
  standalone: true,
  imports: [CommonModule , ReviewComponent , CapitalizePipe , PaymentsEditComponent],
  templateUrl: './payment-applications.component.html',
  styleUrls: ['./payment-applications.component.scss']
})
export class PaymentApplicationsComponent {
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
    paymentId! : number;
    loanamount : string = '';
    repaymentmode : string = '';
    applicationsInfo: any[] = [];
    showApplicationModal = false;
    selectedApplicationId: string = '';
    confirmMessage: string = '';
    showConfirmDialog = false;
    // showAddApplication = false;
    showPaymentEditComponent = false;
    showSanctionComponent = false;
    constructor(private paymentsService: PaymentsService, private toast: CustomToastService) { }
  
    ngOnInit(): void {
      this.getApplications();
    }
  
    openPaymentPopup(data : any) {
      this.showPaymentEditComponent = true;
      this.paymentId = data.paymentId;
      this.action = 'update';
    }

    openAddApplication(msg : any){
      this.action = msg;
      this.showPaymentEditComponent = true;
    }
    onSort(field: string): void {
      if (this.sortField === field) {
        this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
      } else {
        this.sortField = field;
        this.sortOrder = 'asc';
      }
      this.getApplications();
    }
    getSortIcon(field: string): string {
      if (this.sortField === field) {
        return this.sortOrder === 'asc' ? 'bi bi-arrow-down' : 'bi bi-arrow-up';
      }
      return this.hoverField === field ? 'bi bi-arrow-up' : '';
    }

    onSearch(event: any): void {
      const keyword = event.target.value.trim();
      this.field = keyword;
      this.currentPageIndex = 0;
      if (keyword !== '') {
        const requestPayload = {
          pageNumber: 1,
          pageSize: this.pageSize,
          sortField: this.sortField,
          sortOrder: this.sortOrder,
          keyword: keyword,
        };
  
        this.paymentsService.getPaymentAplications(requestPayload).subscribe(
          (response: any) => {
            if (response && response.data && Array.isArray(response.data.content)) {
              this.applicationsInfo = response.data.content;
              this.totalItems = response.data.totalElements;
              this.totalPages = Math.ceil(this.totalItems / this.pageSize);
            } else {
              this.applicationsInfo = [];
              this.totalItems = 0;
              this.totalPages = 1;
            }
          },
          error => {
            console.error('Error fetching applications:', error);
            this.applicationsInfo = [];
            this.totalItems = 0;
            this.totalPages = 1;
          }
        );

      } else {
        this.getApplications(this.currentPageIndex + 1);
      }
    }
    
    getApplications(pageIndex = 1): void {
      const requestPayload = {
        pageNumber: pageIndex,
        pageSize: this.pageSize,
        sortOrder: this.sortOrder,
        sortField: this.sortField,
        keyword: this.field
      };

      this.paymentsService.getPaymentAplications(requestPayload).subscribe({
        next: (response: any) => {
          if (response && response.data && Array.isArray(response.data.content)) {
            this.applicationsInfo = response.data.content;
            this.totalItems = response.data.totalElements;
            this.totalPages = Math.ceil(this.totalItems / this.pageSize);
          } else {
            this.applicationsInfo = [];
            this.totalItems = 0;
            this.totalPages = 1;
          }
        },
        error: (error) => {
          console.error('Error fetching applications:', error);
          this.applicationsInfo = [];
          this.totalItems = 0;
          this.totalPages = 1;
        }
      });
    }
  
    generateSerialNumber(index: number): number {
      return this.currentPageIndex * this.pageSize + index + 1;
    }
  
    goToFirstPage(): void {
      if (this.currentPageIndex > 0) {
        this.currentPageIndex = 0;
        this.getApplications(this.currentPageIndex + 1);
      }
    }
  
    goToPreviousPage(): void {
      if (this.currentPageIndex > 0) {
        this.currentPageIndex--;
        this.getApplications(this.currentPageIndex + 1);
      }
    }
  
    goToNextPage(): void {
      if (this.currentPageIndex < this.totalPages - 1) {
        this.currentPageIndex++;
        this.getApplications(this.currentPageIndex + 1);
      }
    }
  
    goToLastPage(): void {
      if (this.currentPageIndex < this.totalPages - 1) {
        this.currentPageIndex = this.totalPages - 1;
        this.getApplications(this.currentPageIndex + 1);
      }
    }

    closeReviewPopup(){
      this.showPaymentEditComponent = false;
      this.getApplications();
    }
}
