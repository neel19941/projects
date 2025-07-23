import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgToastService } from 'ng-angular-popup';
import { CustomerService } from 'src/app/services/customer.service';
import { PrivilegesService } from 'src/app/services/privileges.service';
import { CapitalizePipe } from 'src/app/core/pipes/capitalize.pipe';
import { CustomerApplicationTrackingComponent } from './customer-application-tracking/customer-application-tracking.component';
import { MissingDocumentsUploadComponent } from './missing-documents-upload/missing-documents-upload.component';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';

@Component({
  selector: 'app-customer-applications',
  standalone: true,
  imports: [CommonModule, CapitalizePipe, CustomerApplicationTrackingComponent, MissingDocumentsUploadComponent],
  templateUrl: './customer-applications.component.html',
  styleUrls: ['./customer-applications.component.scss']
})
export class CustomerApplicationsComponent {
  loanId: number = 0;
  missedDocsloanId: string = '';
  pageIndex = 0;
  pageSize = 50; // items per page
  field = 'empty';
  sortField = 'firstName';
  sortOrder: 'asc' | 'desc' = 'desc'; // Default sort order
  hoverField: string | null = null; // To track which column is being hovered
  currentPageIndex = 0;
  itemsPerPage = 12;
  totalItems: number = 0;
  totalPages: number = 0; // Total pages
  customers: any[] = [];
  private toast = inject(CustomToastService);
  showMissingDocsPopup = false;
  showCustomerApplicationTracking = false;

  constructor(private custServ: CustomerService) { }
  showConfirmDialog = false;
  custId!: number;
  customerToDelete: number | null = null;
  confirmMessage: string = '';
  protected privilegeServ = inject(PrivilegesService);

  ngOnInit(): void {
    this.getCustomers();
  }

  openmissedDocsPopup(customer: any) {
    // alert(customer.loanId);
    this.missedDocsloanId = customer.loanId;
    this.showMissingDocsPopup = true;
  }

  openCustomerTrackingPopup(customer: any) {
    // alert(customer.loanId);
    this.loanId = customer.loanId;
    this.showCustomerApplicationTracking = true;
  }

  closeCustomerTracking(): void {
    this.showCustomerApplicationTracking = false;
    // this.getCustomers();
  }

  closeMissedDocksPopup() {
    this.showMissingDocsPopup = false;
  }

  getStatusClass(status: string): string {
    switch (status?.toLowerCase()) {
      case 'approved':
        return 'status-approved';
      case 'rejected':
        return 'status-rejected';
      case 'sanctioned':
        return 'status-sanctioned';
      case 'reviewed':
        return 'status-reviewed';
      default:
        return 'status-default';
    }
  }

  onSort(field: string): void {
    if (this.sortField === field) {
      // Toggle sorting order if the same field is clicked again
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      // Change field and reset to ascending order
      this.sortField = field;
      this.sortOrder = 'asc';
    }
    this.getCustomers();
  }
  // onSearch(event: any): void {
  //   const keyword = event.target.value.trim();
  //   this.field = keyword;  // Save the keyword for later use

  //   // Reset to first page and recalculate total pages based on the filtered data
  //   this.currentPageIndex = 0;
  //   if (keyword !== '') {
  //     const pagObj = {
  //       pageNumber: 1, // Reset to first page on search
  //       pageSize: this.itemsPerPage,
  //       sortField: this.sortField,
  //       sortOrder: this.sortOrder,
  //       keyword: keyword,
  //     };

  //     this.custServ.postGetCustomers(pagObj).subscribe(
  //       (response: any) => {
  //         if (response && response.data && Array.isArray(response.data.content)) {
  //           this.customers = response.data.content;
  //           this.totalItems = response.data.totalElements;
  //           this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage); // Recalculate total pages
  //           // If the results are fewer than a full page, reset to first page
  //           if (this.totalPages === 0) {
  //             this.currentPageIndex = 0;
  //           }
  //           // Assign serial numbers
  //           this.customers.map((x: any, i) => {
  //             // x.serialNum = this.generateSerialNumber(i);
  //           });
  //         } else {
  //           console.warn('No customer data received.');
  //           this.customers = [];
  //           this.totalItems = 0;
  //           this.totalPages = 1;
  //         }
  //       },
  //       error => {
  //         console.error('Error fetching customers:', error);
  //         this.customers = [];
  //         this.totalItems = 0;
  //         this.totalPages = 1;
  //       }
  //     );
  //   } else {
  //     // If search input is cleared, reload the original customer list
  //     this.getCustomers(this.currentPageIndex + 1);
  //   }
  // }
  getCustomerId() {
    return localStorage.getItem("customerId");
  }
  getCustomers(pagIdx = 1): void {
    // const requestPayload = {
    //   pageNumber: pagIdx,
    //   pageSize: this.itemsPerPage,
    //   sortOrder: this.sortOrder,
    //   sortField: this.sortField,
    //   keyword: this.field
    // };

    // this.custServ.getAllCustomerApplications(customerId).subscribe(
    //   response => {
    //     if (response && response.data && Array.isArray(response.data.content)) {
    //       this.customers = response.data.content;
    //       // this.totalItems = response.data.totalElements;  // Get the correct total count
    //       // this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage); // Calculate pages correctly
    //       // Ensure we don't go out of bounds
    //       // if (this.totalPages > 0 && this.currentPageIndex >= this.totalPages) {
    //       //   this.currentPageIndex = this.totalPages - 1;
    //       // }
    //       // this.customers.map((x: any, i) => {
    //       //   x.serialNum = this.generateSerialNumber(i);
    //       // });
    //       // this.customers.forEach((x: any, i: number) => {
    //       //   x.serialNum = this.generateSerialNumber(i);
    //       // });
    //     } else {
    //       console.warn('No customer data received.');
    //       this.customers = [];
    //       this.totalPages = 1;
    //     }
    //   },
    //   error => {
    //     console.error('Error fetching customers:', error);
    //     this.customers = [];
    //     this.totalPages = 1;
    //   }
    // );
    const customerId = this.getCustomerId(); // Get customer ID dynamically
    this.custServ.getAllCustomerApplications(customerId).subscribe({
      next: (response: any) => {
        if (response && Array.isArray(response.data)) {
          this.customers = response.data;
        } else {
          console.warn('No customer data received.');
          this.customers = [];
          this.totalPages = 1;
        }
      },
      error: (error: any) => {
        console.error('Error fetching customers:', error);
        this.customers = [];
        this.totalPages = 1;
      }
    });
  }
  requestFileUpload(data: any) {
    const id = data.loanId;
    const status = true;
    this.custServ.requestForMissingDocs(id, status).subscribe({
      next: (response: any) => {
               if (response.status === 'success') {
          console.log('Customer deleted successfully', response);
  
          this.toast.success({
            detail: 'Success',
            summary: 'Request Sent Successfully',
            duration: 3000,
          });
  
          // Reload customers with the updated page index
          this.getCustomers();
        } else {
          // API responded, but deletion was not successful
          this.toast.error({
            detail: 'Error',
            summary: 'Failed to request. Please try again.',
            duration: 3000,
          });
        }
      },
      error: (error: any) => {
          this.toast.error({
            detail: 'Error',
            summary: 'Failed to request. Please try again.',
            duration: 3000,
          });
      }
    });
  }
  // generateSerialNumber(index: number): number {
  //   // const pagIdx = this.currentPageIndex === 0 ? 1 : this.currentPageIndex + 1;
  //   // const serialNumber = (pagIdx - 1) * 50 + index + 1;
  //   // return serialNumber;
  //   return this.currentPageIndex * this.itemsPerPage + index + 1;
  // }
  // getSortIcon(field: string): string {
  //   if (this.sortField === field) {
  //     return this.sortOrder === 'asc' ? 'bi bi-arrow-down' : 'bi bi-arrow-up';
  //   }
  //   return this.hoverField === field ? 'bi bi-arrow-up' : ''; // Show up arrow only on hover
  // }

  goToFirstPage(): void {
    if (this.currentPageIndex > 0) {
      this.currentPageIndex = 0;
      this.getCustomers(this.currentPageIndex + 1); // Page index is 0-based, API expects 1-based
    }
  }

  goToPreviousPage(): void {
    if (this.currentPageIndex > 0) {
      this.currentPageIndex--;
      this.getCustomers(this.currentPageIndex + 1);
    }
  }

  goToNextPage(): void {
    if (this.currentPageIndex < this.totalPages - 1) {
      this.currentPageIndex++;
      this.getCustomers(this.currentPageIndex + 1);
    }
  }

  goToLastPage(): void {
    if (this.currentPageIndex < this.totalPages - 1) {
      this.currentPageIndex = this.totalPages - 1;
      this.getCustomers(this.currentPageIndex + 1);
    }
  }

}
