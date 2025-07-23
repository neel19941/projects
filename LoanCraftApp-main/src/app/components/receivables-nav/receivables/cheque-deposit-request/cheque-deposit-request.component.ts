import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PaymentsService } from 'src/app/services/payments.service';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';

@Component({
  selector: 'app-cheque-deposit-request',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './cheque-deposit-request.component.html',
  styleUrls: ['./cheque-deposit-request.component.scss']
})
export class ChequeDepositRequestComponent {
  @Output() closeModal: EventEmitter<void> = new EventEmitter();
  @Input() receivableAmount!: string;
  @Input() requestedAmount!: string;
  @Input() repaymentId! : string;
  showLowChequeAmountRequest : boolean = false;
  chequeDepositRequestForm!: FormGroup;
  constructor(private fb: FormBuilder) { }
    private toast = inject(CustomToastService);
  private paymentsService = inject(PaymentsService);
  readOnly : boolean = false;
  title = "Cheque Deposit Request";

  ngOnInit() {
    this.chequeDepositRequestForm = this.fb.group({
      // receivableAmount: ['', Validators.required],
      // requestedAmount: ['', [Validators.required, Validators.pattern('^[0-9]*$')]]
      receivableAmount: ['', [Validators.required, Validators.pattern("^[0-9,]+(\\.[0-9]{1,2})?$")]],
      requestedAmount: ['', [Validators.required, Validators.pattern("^[0-9,]+(\\.[0-9]{1,2})?$")]],
    });
    this.patchValues();
  }
  patchValues() {
    this.chequeDepositRequestForm.patchValue({
      receivableAmount: this.receivableAmount ? this.formatIndianCurrency(this.receivableAmount) : '',
      requestedAmount: this.requestedAmount ? this.formatIndianCurrency(this.requestedAmount) : '',
    });
    // this.chequeDepositRequestForm.patchValue({
    //   receivableAmount: this.receivableAmount || 0,
    //   requestedAmount: this.requestedAmount || 0,
    // });
  }
  
  formatIndianCurrency(value: any): string {
    if (!value) return '';
    return Number(value).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  close(): void {
    this.closeModal.emit();
  }
  requestChequeDepositForm() {
    this.chequeDepositRequestForm = this.fb.group({
      receivableAmount: ['', Validators.required],
      requestedAmount: ['', [Validators.required, Validators.pattern('^[0-9]*$')]]
    });
  }
  getId() {
    return localStorage.getItem("userId");
  }

  sendData() {
  if (this.chequeDepositRequestForm.invalid) {
    this.chequeDepositRequestForm.markAllAsTouched();
    return;
  }

  const obj = {
    requestById: this.getId(),
    // approvedById: 0,
    repaymentId: this.repaymentId,
    receivableAmount: this.chequeDepositRequestForm.value.receivableAmount.replace(/,/g, ''),
    requestedAmount: this.chequeDepositRequestForm.value.requestedAmount.replace(/,/g, ''),
    // approved: true // 
  };

  this.paymentsService.saveLowChequeApproval(obj).subscribe({
    next: (response: any) => {
      if (response.status === 'success') {
        this.toast.success({
          detail: 'Success',
          summary: 'Loan Cheque Approval saved successfully.',
          duration: 3000
        });
        this.close(); // Optionally close modal
      } else {
        this.toast.error({
          detail: 'Failed',
          summary: 'Something went wrong. Please try again.',
          duration: 3000
        });
      }
    },
    error: (error) => {
      this.toast.error({
        detail: 'Error',
        summary: 'Server error occurred.',
        duration: 3000
      });
      console.error(error);
    }
  });
}

}
