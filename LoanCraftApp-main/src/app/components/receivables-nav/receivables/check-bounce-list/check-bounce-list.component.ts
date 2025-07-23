import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { CapitalizePipe } from 'src/app/core/pipes/capitalize.pipe';
import { PaymentsService } from 'src/app/services/payments.service';
import { LoanSanctionService } from 'src/app/services/loan-sanction.service';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';
import { CheckDepositComponent } from '../check-deposit/check-deposit.component';
import { PrivilegesService } from 'src/app/services/privileges.service';

@Component({
  selector: 'app-check-bounce-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, CheckDepositComponent, NgbDatepickerModule],
  templateUrl: './check-bounce-list.component.html',
  styleUrls: ['./check-bounce-list.component.scss']
})

export class CheckBounceListComponent {
  protected privilegeServ = inject(PrivilegesService);
  showEmiDetailedInfoComponent = false;

      disbursedId: any;
      mode: string = '';
      chequeid : number = 0;
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
      // approved : string = 'approved';
      currentDues : any[] = [];
      showApplicationModal = false;
      selectedApplicationId: string = '';
      confirmMessage: string = '';
      showConfirmDialog = false;
      // showAddApplication = false;
      showReviewComponent = false;
      showSanctionComponent = false;
      constructor(private paymentsService : PaymentsService, private toast: CustomToastService) { }
    
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

        // formatIndianCurrency(value: any): string {
        //   if (!value) return '';
        //      // Convert number to string and format it in the Indian number system
        //       return new Intl.NumberFormat('en-IN', {
        //        minimumFractionDigits: 2,
        //        maximumFractionDigits: 2
        //       }).format(Number(value));
        //  }
    formatIndianCurrency(value: any): string {
    if (value === null || value === undefined) return '';
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
    
         this.paymentsService.getAllCheckBounceList(requestPayload).subscribe({
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

          this.paymentsService.getAllCheckBounceList(requestPayload).subscribe({
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

  openEmiPopup(msg : any) {
    this.mode = msg;
    this.showEmiDetailedInfoComponent = true;
    // this.disbursedId = id;
  }
  
  onStatusClick(due: any): void {
  if (due.status?.toLowerCase() === 'posted') {
    this.openEmiPopupUpdate('update', due);
  }
}

  openEmiPopupUpdate(msg : any , data : any) {
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

 // searchTerm: string = '';
  // searchTermtwo : string = '';
  // checkBounceForm!: FormGroup;
  // receivablesList: any[] = [];
  // filteredList: any[] = [];
  // showEmiDetailedInfoComponent = false;
  // reasonOptions = [
  //   'INSUFFICIENT_FUNDS',
  //   'SIGNATURE_MISMATCH',
  //   'ACCOUNT_CLOSED',
  //   'TECHNICAL_ERROR',
  //   'OTHER'
  // ];
  // itemObj!: any;
  // loanAccNumber: any;
  // disbursedId: any;
  // isDropdownOpen: boolean = false;
  // isSecondDropdownOpen: boolean = false;
  // EmiData: {
  //   loanAmount: number;
  //   outstanding: number;
  //   principal: number;
  //   interest: number;
  //   numberOfEmisDue: number;
  //   repaid: number;
  //   dueDate: string;
  //   emiDueAmount: number;
  //   totalDue: number;
  //   totalPenalty: number;
  //   emiDueInfo: {
  //     emiNumber: number;
  //     dueDate: string;
  //     dueDays: number;
  //     dueAmount: number;
  //     penalty: number;
  //     emiMonth: string;
  //   }[];
  // } | null = null;
  // private sanctionService = inject(LoanSanctionService);
  // private toast = inject(CustomToastService);
  // private paymentsService = inject(PaymentsService);
  // constructor(private fb: FormBuilder) { }

  // ngOnInit() {
  //   this.fetchReceivables();
  //   this.checkBounceForm = this.fb.group({
  //     chequeNumber: ['', Validators.required],
  //     bounceDate: ['', Validators.required],
  //     amount: ['', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
  //     reason: ['', Validators.required],
  //     remarks: ['']
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
  // selectItem(item: any) {
  //   this.itemObj = item;
  //   this.loanAccNumber = item.loanAccountNumber;
  //   this.disbursedId = item.disbursmentId;
  //   this.paymentsService.getEmiInfo(item.disbursmentId).subscribe({
  //     next: (response: any) => {
  //       this.EmiData = response.data; // Directly assign the object
  //       this.toast.success({
  //         detail: 'Success',
  //         summary: 'Details Fetched successfully.',
  //         duration: 3000
  //       });
  //     },
  //     error: (error) => {
  //       console.error('Error fetching EMI Info:', error);
  //       this.EmiData = null;
  //       this.toast.error({
  //         detail: 'Error',
  //         summary: 'Failed to get Details.',
  //         duration: 3000
  //       });
  //     }
  //   });
  //   this.searchTerm = item.firstName + (item.loanAccountNumber ? ` - ${item.loanAccountNumber}` : '');
  //   this.isDropdownOpen = false;
  // }
  // secondselectItem(item : any){
  //   this.itemObj = item;
  //   this.loanAccNumber = item.loanAccountNumber;
  //   this.disbursedId = item.disbursmentId;
  //   this.paymentsService.getEmiInfo(item.disbursmentId).subscribe({
  //     next: (response: any) => {
  //       this.EmiData = response.data; // Directly assign the object
  //       this.toast.success({
  //         detail: 'Success',
  //         summary: 'Details Fetched successfully.',
  //         duration: 3000
  //       });
  //     },
  //     error: (error) => {
  //       console.error('Error fetching EMI Info:', error);
  //       this.EmiData = null;
  //       this.toast.error({
  //         detail: 'Error',
  //         summary: 'Failed to get Details.',
  //         duration: 3000
  //       });
  //     }
  //   });
  //   this.searchTermtwo = item.firstName + (item.loanAccountNumber ? ` - ${item.loanAccountNumber}` : '');
  //   this.isSecondDropdownOpen = false;
  // }
  // toggleDropdown() {
  //   this.isDropdownOpen = !this.isDropdownOpen;
  // }
  // secondToggleDropdown(){
  //   this.isSecondDropdownOpen = !this.isSecondDropdownOpen;
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
  
  // openEmiPopup() {
  //   this.showEmiDetailedInfoComponent = true;
  //   // this.disbursedId = id;
  // }
  
  //   closeEmiPopup() {
  //   this.showEmiDetailedInfoComponent = false;
  //   // this.selectItem(this.itemObj);
  // }
  //   onSearchChange2() {
  //   if (this.searchTermtwo) {
  //     this.filteredList = this.receivablesList.filter(item =>
  //       item.firstName.toLowerCase().includes(this.searchTermtwo.toLowerCase()) ||
  //       (item.loanAccountNumber && item.loanAccountNumber.toLowerCase().includes(this.searchTermtwo.toLowerCase())) ||
  //       item.mobileNumber.includes(this.searchTermtwo)
  //     );
  //   } else {
  //     this.filteredList = [...this.receivablesList];
  //   }
  // }
  // onSubmit() {
  //   if (this.checkBounceForm.valid) {
  //     const formValue = this.checkBounceForm.value;
  //     console.log('Form submitted:', formValue);
  //     // Add API call here
  //   } else {
  //     this.checkBounceForm.markAllAsTouched();
  //   }
  // }