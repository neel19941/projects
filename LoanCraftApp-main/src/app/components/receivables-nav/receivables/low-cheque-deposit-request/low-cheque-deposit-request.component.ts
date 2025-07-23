import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrivilegesService } from 'src/app/services/privileges.service';
import { PaymentsService } from 'src/app/services/payments.service';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';
import { LowChequeRequestActionsComponent } from '../low-cheque-request-actions/low-cheque-request-actions.component';

@Component({
  selector: 'app-low-cheque-deposit-request',
  standalone: true,
  imports: [CommonModule, LowChequeRequestActionsComponent],
  templateUrl: './low-cheque-deposit-request.component.html',
  styleUrls: ['./low-cheque-deposit-request.component.scss']
})
export class LowChequeDepositRequestComponent {

  showEmiDetailedInfoComponent = false;

  disbursedId: any;
  mode: string = '';
  chequeid: number = 0;
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
  loanId: number = 0;
  chequeId: any;
  remarks: any;
  loanamount: string = '';
  repaymentmode: string = '';
  // approved : string = 'approved';
  currentDues: any[] = [];
  showApplicationModal = false;
  selectedApplicationId: string = '';
  confirmMessage: string = '';
  showConfirmDialog = false;
  showChequeDepositRequests = false;
  // showAddApplication = false;
  showReviewComponent = false;
  showSanctionComponent = false;
  protected privilegeServ = inject(PrivilegesService);
  constructor(private paymentsService: PaymentsService, private toast: CustomToastService) { }

  ngOnInit(): void {
    this.getApplications();
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

  formatIndianCurrency(value: any): string {
    if (!value) return '';
    // Convert number to string and format it in the Indian number system
    return new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(Number(value));
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

      this.paymentsService.getAllLowChequeDepositRequests(requestPayload).subscribe({
        next: (response: any) => {
          if (response?.data?.content && Array.isArray(response.data.content)) {
            // Extract data from `content`
            this.currentDues = response.data.content;
            this.totalItems = response.data.totalElements;
            this.totalPages = response.data.totalPages;
          } else {
            this.currentDues = [];
            this.totalItems = 0;
            this.totalPages = 1;
          }
        },
        error: (error) => {
          // console.error('Error fetching current dues:', error);
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

    this.paymentsService.getAllLowChequeDepositRequests(requestPayload).subscribe({
      next: (response: any) => {
        if (response?.data?.content && Array.isArray(response.data.content)) {
          // Extract data from `content`
          this.currentDues = response.data.content;
          this.totalItems = response.data.totalElements;
          this.totalPages = response.data.totalPages;
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
  openChequeDepositRequest(data: any) {
    this.showChequeDepositRequests = true;
    // alert(JSON.stringify(data));
    this.chequeId = data.id;
    this.remarks = data.remarks;
  }

  closeChequeDepositRequest() {
    this.showChequeDepositRequests = false;
    // this.close();
    this.getApplications();
  }


  openEmiPopup(msg: any) {
    this.mode = msg;
    this.showEmiDetailedInfoComponent = true;
    // this.disbursedId = id;
  }

  openEmiPopupUpdate(msg: any, data: any) {
    this.mode = msg;
    this.chequeid = data.id;
    this.showEmiDetailedInfoComponent = true;
    // this.disbursedId = id;
  }

  closeEmiPopup() {
    this.showEmiDetailedInfoComponent = false;
    // this.selectItem(this.itemObj);
    this.getApplications();
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
