import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoanSanctionService } from 'src/app/services/loan-sanction.service';
import { NgToastService } from 'ng-angular-popup';
import { TitleCaseDirective } from 'src/app/core/directives/title-case.directive';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';

@Component({
  selector: 'app-funds-overview',
  standalone: true,
  imports: [CommonModule, FormsModule, TitleCaseDirective, ReactiveFormsModule],
  templateUrl: './funds-overview.component.html',
  styleUrls: ['./funds-overview.component.scss']
})
export class FundsOverviewComponent {
  @Output() closeModal: EventEmitter<void> = new EventEmitter();
  private sanctionService = inject(LoanSanctionService);

  constructor(private fb: FormBuilder) { }

  @Input() sanctionid!: number;
  @Input() processingPercentage!: string;
  @Input() documentCharge!: string;
  @Input() amountSanctioned!: string;

  loanSanctionForm!: FormGroup;
  processingCharge: number = 0;
  disbursedTotalAmount : number = 0;
  private toast = inject(CustomToastService);
  ngOnInit(): void {

    this.loanSanctionForm = this.fb.group({
      // disbursedAmount: ['', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.min(1)]],
      accountNo: ['', [Validators.required, Validators.pattern("^[0-9]{9,18}$")]],
      ifsc: ['', [Validators.required, Validators.pattern("^[A-Z]{4}0[A-Z0-9]{6}$")]],
      // remarks: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
      remarks: ['', [Validators.required, Validators.pattern(/^(?!\s*$)[a-zA-Z\s]+$/)]],

      // branch: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
      branch: ['', [Validators.required, Validators.pattern(/^(?!\s*$)[a-zA-Z\s]+$/)]],
      date: ['', Validators.required]
    })
    this.calculateCharges();
  }
  calculateCharges() {
    let amountSanctioned = parseFloat(this.amountSanctioned) || 0;
    let processingPercentage = parseFloat(this.processingPercentage) || 0;
    let documentCharge = parseFloat(this.documentCharge) || 0;
    this.processingCharge = (amountSanctioned * processingPercentage) / 100;
    this.disbursedTotalAmount = amountSanctioned - (this.processingCharge + documentCharge);
    // this.loanSanctionForm.patchValue({ disbursedAmount: this.disbursedTotalAmount.toFixed(2) });
  }

  formatIndianCurrency(value: any): string {
    if (!value) return '';
    // Convert number to string and format it in the Indian number system
    return new Intl.NumberFormat('en-IN', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    }).format(Number(value));
  }
  
  sendData() {
    if (this.loanSanctionForm.valid) {
      const disbursedObj: any = {
        date: this.loanSanctionForm.value.date,
        accountNo: this.loanSanctionForm.value.accountNo,
        isfc: this.loanSanctionForm.value.ifsc,
        // disbursedAmount: this.loanSanctionForm.value.disbursedAmount,
        disbursedAmount: this.disbursedTotalAmount,
        remarks: this.loanSanctionForm.value.remarks,
        branch: this.loanSanctionForm.value.branch,
        loanSactionId: this.sanctionid,
        status : "disbursed"
      };
      this.sanctionService.saveDisbursment(disbursedObj).subscribe({
        next: (response: any) => {
          if (response.status === "success") {
            console.log('sanction data added successfully:', response);
            this.toast.success({ detail: 'Success', summary: 'successfully loan sanctioned', duration: 3000 });
            this.close();
          } else {
            this.toast.error({ detail: 'Error', summary: 'Loan sanction failed', duration: 3000 });
          }
        },
        error: (err) => {
          console.error('Error sanctioning loan:', err);
          this.toast.error({ detail: 'Error', summary: 'An error occurred while sanctioning the loan', duration: 3000 });
        }
      });
    } else {
      console.log('Form is not valid. Please correct the errors.');
      this.toast.error({
        detail: 'Error',
        summary: 'Form is not valid. Please correct the errors.',
        duration: 3000,
      });
      this.markAllFieldsTouched();
    }
  }
 
  markAllFieldsTouched(): void {
    Object.keys(this.loanSanctionForm.controls).forEach((key) => {
      const control = this.loanSanctionForm.get(key);
      control?.markAsTouched();
      control?.updateValueAndValidity();
    });
  }
  close(): void {
    this.closeModal.emit();
  }
}
