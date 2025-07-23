import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApplicationsService } from 'src/app/services/applications.service';
import { NgToastService } from 'ng-angular-popup';
import { ReviewComponent } from '../applications-list/review/review.component';
import { CapitalizePipe } from 'src/app/core/pipes/capitalize.pipe';
import { PrivilegesService } from 'src/app/services/privileges.service';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';
import { VerifyDocumentsComponent } from '../applications-list/verify-documents/verify-documents.component';
import { CustomerRequestsComponent } from '../applications-list/customer-requests/customer-requests.component';

@Component({
  selector: 'app-rejected-applications',
  standalone: true,
  imports: [CommonModule, ReviewComponent, CapitalizePipe, VerifyDocumentsComponent , CustomerRequestsComponent],
  templateUrl: './rejected-applications.component.html',
  styleUrls: ['./rejected-applications.component.scss']
})
export class RejectedApplicationsComponent {
  pageIndex = 0;
  pageSize = 50; // Items per page
  field = 'empty';
  sortField = 'applicationName';
  sortOrder: 'asc' | 'desc' = 'desc'; // Default sort order
  hoverField: string | null = null;
  currentPageIndex = 0;
  totalItems: number = 0;
  totalPages: number = 0;
  target: string = '';
  loanId: number = 0;
  loanamount: string = '';
  repaymentmode: string = '';
  approved: string = 'rejected';
  applicationsInfo: any[] = [];
  showApplicationModal = false;
  selectedApplicationId: string = '';
  confirmMessage: string = '';
  showConfirmDialog = false;
   showRequestComponent = false;
  // showAddApplication = false;
  showReviewComponent = false;
  showSanctionComponent = false;
  showVerifyDocsComponent = false;
  protected privilegeServ = inject(PrivilegesService);
  constructor(private applicationService: ApplicationsService, private toast: CustomToastService) { }
  ngOnInit(): void {
    this.getApplications();
  }
  openReviewPopup(id: any) {
    this.showReviewComponent = true;
    this.loanId = id;
  }
  openVerification(id: any) {
    this.showVerifyDocsComponent = true;
    this.loanId = id;
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

  // onVerifyClick(application: any): void {
  //   if (application.status?.toLowerCase() === 'reviewed') {
  //     this.openVerification(application.loanId);
  //   }
  // }
  
  getSortIcon(field: string): string {
    if (this.sortField === field) {
      return this.sortOrder === 'asc' ? 'bi bi-arrow-down' : 'bi bi-arrow-up';
    }
    return this.hoverField === field ? 'bi bi-arrow-up' : '';
  }
       openRequestModel(id: any) {
    this.showRequestComponent = true;
    this.loanId = id;
  }

    closeRequestPopup() {
    this.showRequestComponent = false;189
    this.getApplications();
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
        status: 'rejected'
      };

      this.applicationService.getApprovedApplications(requestPayload).subscribe(
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
      keyword: this.field,
      status: 'rejected'
    };

    this.applicationService.getApprovedApplications(requestPayload).subscribe({
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

  closeReviewPopup() {
    this.showReviewComponent = false;
    this.getApplications();
  }

  closeVerifyDocsPopup() {
    this.showVerifyDocsComponent = false;
    this.getApplications();
  }

}
