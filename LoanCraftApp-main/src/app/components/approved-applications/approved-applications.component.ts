import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApplicationsService } from 'src/app/services/applications.service';
import { NgToastService } from 'ng-angular-popup';
import { ReviewComponent } from '../applications-list/review/review.component';
import { CapitalizePipe } from 'src/app/core/pipes/capitalize.pipe';
import { SanctionApplicationComponent } from '../sanction-application/sanction-application.component';
import { PrivilegesService } from 'src/app/services/privileges.service';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';
import { CustomerRequestsComponent } from '../applications-list/customer-requests/customer-requests.component';

@Component({
  selector: 'app-approved-applications',
  standalone: true,
  imports: [CommonModule , ReviewComponent , CapitalizePipe , SanctionApplicationComponent , CustomerRequestsComponent],
  templateUrl: './approved-applications.component.html',
  styleUrls: ['./approved-applications.component.scss']
})
export class ApprovedApplicationsComponent {
  
    pageIndex = 0;
    pageSize = 50; // Items per page
    field = 'empty';
    sortField = 'updateddate';
    sortOrder: 'asc' | 'desc' = 'desc'; // Default sort order
    hoverField: string | null = null;
    currentPageIndex = 0;
    totalItems: number = 0;
    totalPages: number = 0;
    target: string = '';
    loanId : number = 0;
    loanamount : string = '';
    repaymentmode : string = '';
    loanStatus : string = 'Approved';
    applicationsInfo: any[] = [];
    showApplicationModal = false;
    selectedApplicationId: string = '';
    confirmMessage: string = '';
    showConfirmDialog = false;
    // showAddApplication = false;
    showReviewComponent = false;
    showSanctionComponent = false;
      showRequestComponent = false;
    protected privilegeServ = inject(PrivilegesService);
    constructor(private applicationService: ApplicationsService, private toast: CustomToastService) { }
  
    ngOnInit(): void {
      this.getApplications();
    }
  
    openReviewPopup(id : any) {
      this.showReviewComponent = true;
      this.loanId = id;
    }
    
     openRequestModel(id: any) {
    this.showRequestComponent = true;
    this.loanId = id;
  }
    openSanctionPopup(data : any){
if(data.physicalVerification === true){
      this.showSanctionComponent = true;
      this.loanId = data.loanId;
      this.loanamount = data.loanamount;
      this.repaymentmode = data.repaymentmode;
    } else{
          this.toast.error({ detail: 'Error', summary: 'Please complete physical verification before proceeding.', duration: 3000 });
     }
    }

    // closeAddApplication(): void {
    //   this.showReviewComponent = false;
    //   this.getApplications();
    // }
  
    // openApplicationModal(applicationId: string): void {
    //   this.selectedApplicationId = applicationId;
    //   this.showApplicationModal = true;
    // }
  
    // closeApplicationModal() {
    //   this.showApplicationModal = false;
    //   this.getApplications();
    // }
  
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
          status : 'Approved'
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
        status : 'Approved'
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
    sanctionLoan(loanId: number) {
      console.log(`Sanctioning loan for Loan ID: ${loanId}`);
      // Implement the sanction logic here
    }
    
    // getApplications(): void {
    //   this.applicationService.getAllApplications().subscribe({
    //     next: (response: any) => {
    //       if (response && response.status === "succuss" && Array.isArray(response.data)) {
    //         this.applicationsInfo = response.data;
    //       } else {
    //         this.applicationsInfo = [];
    //       }
    //     },
    //     error: (error) => {
    //       console.error('Error fetching applications:', error);
    //       this.applicationsInfo = [];
    //     }
    //   });
    // }
    closeSanctionPopup(){
      this.showSanctionComponent  = false;
      this.getApplications();
    }
    closeReviewPopup(){
      this.showReviewComponent = false;
      this.getApplications();
    }
    closeRequestPopup() {
    this.showRequestComponent = false;
    this.getApplications();
  }
}
