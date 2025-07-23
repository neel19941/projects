import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgToastService } from 'ng-angular-popup';
import { PaymentsService } from 'src/app/services/payments.service';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';

@Component({
  selector: 'app-payments-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './payments-edit.component.html',
  styleUrls: ['./payments-edit.component.scss']
})
export class PaymentsEditComponent {
  @Output() closeModal: EventEmitter<void> = new EventEmitter();
  @Input() PaymentId!: number;
  @Input() action!: string;
  disbursmentId!: number;
  title: string = 'Add Payment';
  private data: any;
  isEditMode: boolean = false;
  paymentApplicationForm!: FormGroup;
  private toast = inject(CustomToastService);
  private paymentService = inject(PaymentsService);

  constructor(private fb: FormBuilder) { }
  ngOnInit(): void {
    // this.paymentApplicationForm = this.fb.group({
    //   // disbursedAmount: ['', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.min(1)]],
    //   accountNo: ['', [Validators.required, Validators.pattern("^[0-9]{9,18}$")]],
    //   ifsc: ['', [Validators.required, Validators.pattern("^[A-Z]{4}0[A-Z0-9]{6}$")]],
    //   remarks: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
    //   branch: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
    //   date: ['', Validators.required]
    // })
    this.intializeForm();
    if (this.action === 'update' && this.PaymentId) {
      this.loadpaymentData();
      this.title = 'Update payment';
      this.isEditMode = true;
    }
  }

  intializeForm() {
    this.paymentApplicationForm = this.fb.group({
      // dueAmount: [0, [Validators.required, Validators.pattern("^[0-9]*$"), Validators.min(0)]],
      dueAmount: [0, [Validators.required, Validators.pattern("^[0-9]*\\.?[0-9]*$"), Validators.min(0)]],
      dueDate: ['', Validators.required],
      amountPaid: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
      amountStatus: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]] // Ensures only alphabets and spaces
    });
  }
  private loadpaymentData(): void {
    if (!this.PaymentId) {
      console.error('Role ID not found.');
      return;
    }
    this.paymentService.findPaymentById(this.PaymentId).subscribe({
      next: (data) => {
        this.data = data;
        this.disbursmentId = this.data.data.disbursment.disbursmentId;
        this.populateForm(this.data);
      },
      error: (error) => {
        console.error('Error fetching payment data:', error);
      }
    });
  }

  private populateForm(data: any): void {
    this.paymentApplicationForm.patchValue({
      dueAmount: data.data.dueAmount ? parseFloat(data.data.dueAmount.toFixed(2)) : '',
      dueDate: data.data.dueDate || '',
      amountPaid: data.data.amountPaid || '',
      amountStatus: data.data.amountStatus || ''
    });
  }

  sendData(): void {
    if (this.paymentApplicationForm.valid) {
      const paymentData = {
        dueAmount: this.paymentApplicationForm.value.dueAmount,
        dueDate: this.paymentApplicationForm.value.dueDate,
        amountPaid: this.paymentApplicationForm.value.amountPaid,
        amountStatus: this.paymentApplicationForm.value.amountStatus,
        // disbursmentId : 2
      };
      this.paymentService.saveThePaymentData(paymentData).subscribe({
        next: (response: any) => {
          if (response.status === "success") {
            this.toast.success({
              detail: 'Success',
              summary: 'Payment added successfully.',
              duration: 3000
            });
            this.close();
          }
          else {
            this.toast.error({
              detail: 'Error',
              summary: response.message,
              duration: 3000
            });

          }
        },
        error: (error) => {
          console.error('Error adding payment:', error);
          this.toast.error({
            detail: 'Error',
            summary: 'Failed to add payment.',
            duration: 3000
          });
        }
      });
    } else {
      this.toast.error({
        detail: 'Error',
        summary: 'Form is not valid. Please correct the errors.',
        duration: 3000
      });
      this.markAllFieldsTouched();
    }
  }

  updateData(): void {
    if (this.paymentApplicationForm.valid) {
      const paymentData = {
        paymentId: this.PaymentId,
        dueAmount: this.paymentApplicationForm.value.dueAmount,
        dueDate: this.paymentApplicationForm.value.dueDate,
        amountPaid: this.paymentApplicationForm.value.amountPaid,
        amountStatus: this.paymentApplicationForm.value.amountStatus,
        disbursmentId: this.disbursmentId
      };
      this.paymentService.updatePaymentmethod(paymentData).subscribe({
        next: (response: any) => {
          if (response.status === "success") {
            this.toast.success({
              detail: 'Success',
              summary: 'Role updated successfully.',
              duration: 3000
            });
            this.close();
          }
          else {
            this.toast.error({
              detail: 'Error',
              summary: 'Failed to update payment.' + response.message,
              duration: 3000
            });
          }

        },
        error: (error) => {
          console.error('Error updating payment:', error);
          this.toast.error({
            detail: 'Error',
            summary: 'Failed to update payment.',
            duration: 3000
          });
        }
      });
    } else {
      this.toast.error({
        detail: 'Error',
        summary: 'Form is not valid. Please correct the errors.',
        duration: 3000
      });
      this.markAllFieldsTouched();
    }
  }
  markAllFieldsTouched(): void {
    Object.keys(this.paymentApplicationForm.controls).forEach((key) => {
      const control = this.paymentApplicationForm.get(key);
      control?.markAsTouched();
      control?.updateValueAndValidity();
    });
  }

  close(): void {
    this.closeModal.emit();
  }
}
