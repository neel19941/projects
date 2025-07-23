import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { forkJoin } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ApplicationsService } from 'src/app/services/applications.service';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';
import { CustomerService } from 'src/app/services/customer.service';

@Component({
  selector: 'app-customer-requests',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './customer-requests.component.html',
  styleUrls: ['./customer-requests.component.scss']
})
export class CustomerRequestsComponent {
  @Input() LoanId!: number;
  @Output() closeModal: EventEmitter<void> = new EventEmitter();
  private appServ = inject(ApplicationsService);
  private toast = inject(CustomToastService);
  // isLoading: boolean = true; // Show loader until data is ready
  reviewData: any; // Stores the API response
  title = "Customer Requests";
  loanId!: number;
  ngOnInit() {
    this.data();
  }
  constructor(private custServ: CustomerService) { }
  data() {
    this.appServ.getFindById(this.LoanId).subscribe({
      next: (response: any) => {
        if (response.status === "success") {
          this.reviewData = response.data;
          this.loanId = this.reviewData.loanId;
        } else {

        }
        // this.isLoading = false; // Stop loader
      },
      error: (err) => {
        // this.isLoading = false;
      }
    });
  }
  // acceptRequest(): void {
  //   console.log('Accepted Request for Loan ID:', this.loanId);
  //   this.close(); // Close modal after action
  // }

  acceptRequest() {
    const id = this.loanId;
    const status = true;

    this.custServ.acceptRequestForUpload(id, status).subscribe({
      next: (response: any) => {
        if (response.status === 'success') {
          this.toast.success({
            detail: 'Success',
            summary: 'Request Accepted Successfully',
            duration: 3000,
          });
            this.close();
        } else {
          this.toast.error({
            detail: 'Error',
            summary: 'Failed to Accept. Please try again.',
            duration: 3000,
          });
            this.close();
        }
      },
      error: (error: any) => {
        this.toast.error({
          detail: 'Error',
          summary: 'Failed to request. Please try again.',
          duration: 3000,
        });
          this.close();
      }
    });

  }
Reject() {
  const id = this.loanId;
  const status = false;

  const acceptRequest$ = this.custServ.acceptRequestForUpload(id, status);
  const requestDocs$ = this.custServ.requestForMissingDocs(id, status);

  forkJoin([acceptRequest$, requestDocs$]).subscribe({
    next: ([acceptResponse, requestResponse]: [any, any]) => {
      if (
        acceptResponse?.status === 'success' &&
        requestResponse?.status === 'success'
      ) {
        this.toast.success({
          detail: 'Success',
          summary: 'Request Rejected',
          duration: 3000,
        });
        this.close();
      } else {
        this.toast.error({
          detail: 'Error',
          summary: 'Request Rejected failed. Please try again.',
          duration: 3000,
        });
        this.close();
      }
    },
    error: () => {
      this.toast.error({
        detail: 'Error',
        summary: 'Failed to process rejection. Please try again.',
        duration: 3000,
      });
        this.close();
    },
  });
}

  close(): void {
    this.closeModal.emit();
  }

}
