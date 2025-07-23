import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentsEditComponent } from '../payments-edit/payments-edit.component';
import { PrivilegesService } from 'src/app/services/privileges.service';
import { LoanSanctionService } from 'src/app/services/loan-sanction.service';
import { PaymentsService } from 'src/app/services/payments.service';
import { CapitalizePipe } from 'src/app/core/pipes/capitalize.pipe';
import { NgToastService } from 'ng-angular-popup';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';

@Component({
  selector: 'app-current-month-dues',
  standalone: true,
    imports: [CommonModule , PaymentsEditComponent , CapitalizePipe],
  templateUrl: './current-month-dues.component.html',
  styleUrls: ['./current-month-dues.component.scss']
})
export class CurrentMonthDuesComponent {
  // currentDues : any[] = [];
  // hoverField: string | null = null;
  // protected privilegeServ = inject(PrivilegesService);
  // private sanctionService = inject(LoanSanctionService);
  // private paymentsService = inject(PaymentsService);

  // ngOnInit(){
  //      this.fetchAllCurrentDues();
  // }
  
  // fetchAllCurrentDues(): void {
  //   this.paymentsService.getCurrentDues().subscribe({
  //     next: (response: any) => {
  //       if (Array.isArray(response)) {
  //         // Assign the response directly if it's already an array
  //         this.currentDues = response;
  //       } else if (response && response.data && Array.isArray(response.data.content)) {
  //         // Handle a nested response structure if needed
  //         this.currentDues = response.data.content;
  //       } else {
  //         // Assign an empty array if response is invalid
  //         this.currentDues = [];
  //       }
  //     },
  //     error: (error) => {
  //       console.error('Error fetching current dues:', error);
  //     }
  //   });
  // }
  
      pageIndex = 0;
      pageSize = 50; // Items per page
      field = 'empty';
      sortField = 'amountStatus';
      sortOrder: 'asc' | 'desc' = 'desc'; // Default sort order
      hoverField: string | null = null;
      currentPageIndex = 0;
      totalItems: number = 0;
      totalPages: number = 0;
      target: string = '';
      loanId : number = 0;
      loanamount : string = '';
      repaymentmode : string = '';
      // approved : string = 'approved';
      currentDues : any[] = [];
      showApplicationModal = false;
      selectedApplicationId: string = '';
      confirmMessage: string = '';
      showConfirmDialog = false;
      // showAddApplication = false;
      showReviewComponent = false;
      showSanctionComponent = false;
      protected privilegeServ = inject(PrivilegesService);
      constructor(private paymentsService : PaymentsService, private toast: CustomToastService) { }
    
      ngOnInit(): void {
        this.getApplications();
      }
    
      // openReviewPopup(id : any) {
      //   this.showReviewComponent = true;
      //   this.loanId = id;
      // }
      // openSanctionPopup(data : any){
      //   this.showSanctionComponent = true;
      //   this.loanId = data.loanId;
      //   this.loanamount = data.loanamount;
      //   this.repaymentmode = data.repaymentmode;
      // }
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
          };
    
          this.paymentsService.getCurrentDues(requestPayload).subscribe({
            next: (response: any) => {
              if (response && Array.isArray(response.content)) { 
                // Extract data from `content`
                this.currentDues = response.content;
                this.totalItems = response.totalElements;
                this.totalPages = response.totalPages;
              } else {
                this.currentDues = [];
                this.totalItems = 0;
                this.totalPages = 1;
              }
            },
            error: (error) => {
              console.error('Error fetching current dues:', error);
              this.currentDues = [];
              this.totalItems = 0;
              this.totalPages = 1;
            }
          });
  
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
  
        // this.paymentsService.getCurrentDues(requestPayload).subscribe({
        //   next: (response: any) => {
        //     if (response && response.data && Array.isArray(response.data.content)) {
        //       this.currentDues = response.data.content;
        //       this.totalItems = response.data.totalElements;
        //       this.totalPages = Math.ceil(this.totalItems / this.pageSize);
        //     } else {
        //       this.currentDues = [];
        //       this.totalItems = 0;
        //       this.totalPages = 1;
        //     }
        //   },
        //   error: (error) => {
        //     console.error('Error fetching applications:', error);
        //     this.currentDues = [];
        //     this.totalItems = 0;
        //     this.totalPages = 1;
        //   }
        // });
        this.paymentsService.getCurrentDues(requestPayload).subscribe({
          next: (response: any) => {
            if (response && Array.isArray(response.content)) { 
              // Extract data from `content`
              this.currentDues = response.content;
              this.totalItems = response.totalElements;
              this.totalPages = response.totalPages;
            } else {
              this.currentDues = [];
              this.totalItems = 0;
              this.totalPages = 1;
            }
          },
          error: (error) => {
            console.error('Error fetching current dues:', error);
            this.currentDues = [];
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

}
