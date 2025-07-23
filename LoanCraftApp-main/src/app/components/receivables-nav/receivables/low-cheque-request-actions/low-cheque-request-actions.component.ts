import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';
import { PaymentsService } from 'src/app/services/payments.service';

@Component({
  selector: 'app-low-cheque-request-actions',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './low-cheque-request-actions.component.html',
  styleUrls: ['./low-cheque-request-actions.component.scss']
})

export class LowChequeRequestActionsComponent {

  @Output() closeModal: EventEmitter<void> = new EventEmitter();

  @Input() chequeId!: string;

  @Input() remarks!: string;

  chequeDepositRequestForm!: FormGroup;

  constructor(private fb: FormBuilder) { }

  private toast = inject(CustomToastService);

  private paymentsService = inject(PaymentsService);

  title = "Low Cheque Deposit Requests";

  ngOnInit() {
    this.chequeDepositRequestForm = this.fb.group({
      remarks: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\s]*$/)]]
    });
  }
  close(): void {
    this.closeModal.emit();
  }

lowChequeRequestActions(data: 'true' | 'false') {
  if (this.chequeDepositRequestForm.invalid) {
    this.chequeDepositRequestForm.markAllAsTouched();
    return; // Stop here if form is invalid
  }

  const remarks = this.chequeDepositRequestForm.value.remarks;

  this.paymentsService.lowChequeRequestApproval(this.chequeId, data, remarks).subscribe({
    next: (response: any) => {
      if (response?.status === 'success') {
        this.toast.success({
          detail: 'Success',
          summary: `Request ${data === 'true' ? 'approved' : 'rejected'} successfully.`,
          duration: 3000
        });
        this.close(); // Close the modal on success
      } else {
        this.toast.error({
          detail: 'Error',
          summary: response?.message || 'Operation failed.',
          duration: 3000
        });
      }
    },
    error: (err) => {
      console.error('Request error:', err);
      this.toast.error({
        detail: 'Error',
        summary: 'Something went wrong while processing the request.',
        duration: 3000
      });
    }
  });
}


}
