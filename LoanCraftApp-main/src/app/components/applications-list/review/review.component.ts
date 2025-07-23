import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApplicationsService } from 'src/app/services/applications.service';
import { NgToastService } from 'ng-angular-popup';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CapitalizePipe } from 'src/app/core/pipes/capitalize.pipe';
import { TitleCaseDirective } from 'src/app/core/directives/title-case.directive';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';

@Component({
  selector: 'app-review',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, CapitalizePipe, TitleCaseDirective],
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.scss']
})
export class ReviewComponent {
  @Output() closeModal: EventEmitter<void> = new EventEmitter();
  @Input() LoanId!: number;

  @Input() applicantStatus!: string;

  private appServ = inject(ApplicationsService);
  private toast = inject(CustomToastService);
  title: string = 'Application Review';
  reviewData: any; // Stores the API response
  isLoading: boolean = true; // Show loader until data is ready
  remarks: string = ''; // Store remarks from textarea
  loanId!: number;
  isReviewed: boolean = false;
  cbilScore!: number | null;
  isCbilProvided: boolean = false;
  ngOnInit() {
    this.data();
  }

  reject() {

    if (!this.remarks || this.remarks.trim() === '') {
      this.toast.warning({ detail: 'Warning', summary: 'Remarks can not be empty', duration: 3000 });
      return;
    }
      if (this.cbilScore === null || this.cbilScore === undefined || this.cbilScore.toString().trim() === '' || isNaN(this.cbilScore) || this.cbilScore < 100 || this.cbilScore > 1000) {
          this.toast.warning({detail: 'Warning', summary: 'Please enter a CIBIL score between 100 and 1000.', duration: 3000});
           return;
      }

    // alert(this.remarks);
    const feedbackObj = {
      status: 'rejected',
      remarks: this.remarks,
      loanId: this.loanId,
      cbilScore: this.cbilScore
    };
    this.appServ.reviewStatus(feedbackObj).subscribe({
      next: () => {
        this.toast.success({ detail: 'Success', summary: 'Application Rejected', duration: 3000 });
        this.close();
      },
      error: () => {
        this.toast.error({ detail: 'Error', summary: 'Something went wrong', duration: 3000 });
      }
    });
  }
  formatIndianCurrency(value: any): string {
    if (!value) return '';
    // Convert number to string and format it in the Indian number system
    return new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(Number(value));
  }
  checkCbilProvided() {
    this.isCbilProvided = this.cbilScore != null && this.cbilScore !== undefined && this.cbilScore.toString().trim() !== '';
  }

  Reviewed() {

    // if (!this.remarks || this.remarks.trim() === '') {
    //   this.toast.warning({ detail: 'Warning', summary: 'Remarks cannot be empty', duration: 3000 });
    //   return;
    // }

      if (this.cbilScore === null || this.cbilScore === undefined || this.cbilScore.toString().trim() === '' || isNaN(this.cbilScore) || this.cbilScore < 100 || this.cbilScore > 1000) {
          this.toast.warning({detail: 'Warning', summary: 'Please enter a CIBIL score between 100 and 1000.', duration: 3000});
           return;
      }
       
    const feedbackObj = {
      status: "Reviewed",
      remarks: this.remarks,
      loanId: this.loanId,
      cbilScore: this.cbilScore
    }
    this.appServ.reviewStatus(feedbackObj).subscribe({
      next: () => {
        this.toast.success({ detail: 'Success', summary: 'Application Approved', duration: 3000 });
        this.close();
      },
      error: () => {
        this.toast.error({ detail: 'Error', summary: 'Something went wrong', duration: 3000 });
      }
    });
  }
  data() {
    this.appServ.getFindById(this.LoanId).subscribe({
      next: (response: any) => {
        if (response.status === "success") {
          this.reviewData = response.data;
          this.loanId = this.reviewData.loanId;
        } else {

        }
        this.isLoading = false; // Stop loader
      },
      error: (err) => {
        this.isLoading = false;
      }
    });
  }
  close(): void {
    this.closeModal.emit();
  }
}
