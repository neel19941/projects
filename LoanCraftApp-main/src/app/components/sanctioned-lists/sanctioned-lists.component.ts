import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoanSanctionService } from 'src/app/services/loan-sanction.service';
import { FundsOverviewComponent } from './funds-overview/funds-overview.component';
import { CapitalizePipe } from 'src/app/core/pipes/capitalize.pipe';
import { PrivilegesService } from 'src/app/services/privileges.service';
import { NgToastService } from 'ng-angular-popup';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';
import { CustomerRequestsComponent } from '../applications-list/customer-requests/customer-requests.component';

@Component({
  selector: 'app-sanctioned-lists',
  standalone: true,
  imports: [CommonModule ,  CapitalizePipe , FundsOverviewComponent , CustomerRequestsComponent],
  templateUrl: './sanctioned-lists.component.html',
  styleUrls: ['./sanctioned-lists.component.scss']
})
export class SanctionedListsComponent {
  pageIndex = 0;
  pageSize = 50;
  field = 'empty';
  sortField = 'updateddate';
  sortOrder: 'asc' | 'desc' = 'desc';
  hoverField: string | null = null;
    loanId: number = 0;
  currentPageIndex = 0;
  itemsPerPage = 50;
  totalItems: number = 0;
  totalPages: number = 0;
  sanctionid : number = 0;
  amountSanctioned : string = '';
  processingCharge : string = '';
  documentCharge : string = '';
  showFundsPopup = false;
   showRequestComponent = false;
  selectedApplicationId: string = '';
  sanctionedApplications : any[] = [];
  private sanctionService = inject(LoanSanctionService);
  protected privilegeServ = inject(PrivilegesService);
 private toast = inject(CustomToastService);
  constructor() {}

  ngOnInit(): void {
    this.getSanctionedApplications();
  }

  onSort(field: string): void {
    if (this.sortField === field) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortOrder = 'asc';
    }
    this.getSanctionedApplications();
  }
  closeAddSanctionedApplication(){
      this.showFundsPopup = false;
      this.getSanctionedApplications();
  }
     openRequestModel(id: any) {
    this.showRequestComponent = true;
    this.loanId = id;
  }
      closeRequestPopup() {
    this.showRequestComponent = false;
    this.getSanctionedApplications();
  }
  onSearch(event: any): void {
    const keyword = event.target.value.trim();
    this.field = keyword;
    this.currentPageIndex = 0;
    this.getSanctionedApplications(this.currentPageIndex + 1);
  }

  viewDisbursedDetails(data : any){
    // if(data.physicalVerification === true){
     this.showFundsPopup = true;
     this.processingCharge = data.loanProcessingCharges;
     this.sanctionid = data.sanctionid;
     this.amountSanctioned = data.amountSanctioned;
     this.documentCharge = data.documentationCharges;
    // } else{
    //       this.toast.error({ detail: 'Error', summary: 'Please complete physical verification before proceeding.', duration: 3000 });
    //  }
  }

  
  formatIndianCurrency(value: any): string {
    if (!value) return '';
    // Convert number to string and format it in the Indian number system
    return new Intl.NumberFormat('en-IN', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    }).format(Number(value));
  }

  getSanctionedApplications(pageIndex = 1): void {
    const requestPayload = {
      pageNumber: pageIndex,
      pageSize: this.itemsPerPage,
      sortOrder: this.sortOrder,
      sortField: this.sortField,
      keyword: this.field
    };
    this.sanctionService.postGetAplications(requestPayload).subscribe(
      response => {
        if (response && response.data && Array.isArray(response.data.content)) {
          this.sanctionedApplications = response.data.content;
          this.totalItems = response.data.totalElements;
          this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
          if (this.totalPages > 0 && this.currentPageIndex >= this.totalPages) {
            this.currentPageIndex = this.totalPages - 1;
          }
          this.sanctionedApplications.forEach((x: any, i: number) => {
            x.serialNum = this.generateSerialNumber(i);
          });
        } else {
          console.warn('No application data received.');
          this.sanctionedApplications = [];
          this.totalPages = 1;
        }
      },
      error => {
        console.error('Error fetching application data:', error);
        this.sanctionedApplications = [];
        this.totalPages = 1;
      }
    );
  }

  generateSerialNumber(index: number): number {
    return this.currentPageIndex * this.itemsPerPage + index + 1;
  }

  getSortIcon(field: string): string {
    if (this.sortField === field) {
      return this.sortOrder === 'asc' ? 'bi bi-arrow-down' : 'bi bi-arrow-up';
    }
    return this.hoverField === field ? 'bi bi-arrow-up' : '';
  }

  goToFirstPage(): void {
    if (this.currentPageIndex > 0) {
      this.currentPageIndex = 0;
      this.getSanctionedApplications(this.currentPageIndex + 1);
    }
  }

  goToPreviousPage(): void {
    if (this.currentPageIndex > 0) {
      this.currentPageIndex--;
      this.getSanctionedApplications(this.currentPageIndex + 1);
    }
  }

  goToNextPage(): void {
    if (this.currentPageIndex < this.totalPages - 1) {
      this.currentPageIndex++;
      this.getSanctionedApplications(this.currentPageIndex + 1);
    }
  }

  goToLastPage(): void {
    if (this.currentPageIndex < this.totalPages - 1) {
      this.currentPageIndex = this.totalPages - 1;
      this.getSanctionedApplications(this.currentPageIndex + 1);
    }
  }
}
