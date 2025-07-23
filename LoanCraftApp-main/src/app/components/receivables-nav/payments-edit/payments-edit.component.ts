import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgToastService } from 'ng-angular-popup';
import { PaymentsService } from 'src/app/services/payments.service';
import { TitleCaseDirective } from 'src/app/core/directives/title-case.directive';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';

@Component({
  selector: 'app-payments-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, TitleCaseDirective],
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
  readableContent: boolean = false;
  paymentModes: string[] = ['Cash', 'UPI', 'Bank Transfer'];
  paymentApplicationForm!: FormGroup;
  private toast = inject(CustomToastService);
  private paymentService = inject(PaymentsService);

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.intializeForm();
    if (this.action === 'update' && this.PaymentId) {
      this.loadpaymentData();
      this.title = 'Make payment';
      this.isEditMode = true;
    }

  }
  formatIndianCurrency(value: any): string {
    if (!value) return '';
    return Number(value).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
  formatAmountSanctioned(fieldName: string) {
    let value = this.paymentApplicationForm.get(fieldName)?.value;

    // Remove non-numeric characters
    value = value.replace(/[^0-9]/g, '');

    // Convert to number and format with commas
    if (value) {
      value = parseInt(value, 10).toLocaleString('en-IN'); // Indian number format
      this.paymentApplicationForm.patchValue({ [fieldName]: value }, { emitEvent: false });
    }
  }
  
  intializeForm() {
    this.paymentApplicationForm = this.fb.group({
      // dueAmount: [0, [Validators.required, Validators.pattern("^[0-9]*$"), Validators.min(0)]],
      dueAmount: ['', [Validators.required, Validators.pattern("^[0-9,]+(\\.[0-9]{1,2})?$"), Validators.min(1)]],
      dueDate: ['', Validators.required],
      interestAmount: ['', [Validators.required, Validators.pattern("^[0-9]+$"), Validators.min(1)]],
      amountPaid: ['', [Validators.required, Validators.pattern("^[0-9,.]+$"), Validators.min(1)]],
      paymentMode: ['', Validators.required],
      remarks: ['', [Validators.pattern('^[a-zA-Z ]*$')]],
      checkBounce: ['', [Validators.pattern("^[0-9]+(\\.[0-9]{1,2})?$")]],
      // amountStatus: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]] // Ensures only alphabets and spaces
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
      dueAmount: data.data.dueAmount ? this.formatIndianCurrency(data.data.dueAmount) : '',
      dueDate: data.data.dueDate || '',
      amountPaid: data.data.amountPaid ? this.formatIndianCurrency(data.data.amountPaid) : '',
      // amountStatus: data.data.amountStatus || ''
    });
  }

  sendData(): void {
    let dueAmountRaw = this.paymentApplicationForm.value.dueAmount;

    // Remove commas and decimal part
    let dueAmountCleaned = dueAmountRaw.replace(/,/g, '').split('.')[0]; // "16600"

    // Update the form control with the cleaned value (optional)
    this.paymentApplicationForm.get('dueAmount')?.setValue(dueAmountCleaned);
  let amountPaidRaw = this.paymentApplicationForm.value.amountPaid;

  // Remove commas and decimal part, then convert to number
  let amountPaidCleaned = Number(amountPaidRaw.replace(/,/g, '').split('.')[0]);

  // Update the form value if needed
  this.paymentApplicationForm.get('amountPaid')?.setValue(amountPaidCleaned);
    if (this.paymentApplicationForm.valid) {
      const paymentData = {
        // dueAmount: this.paymentApplicationForm.value.dueAmount,
        // dueDate: this.paymentApplicationForm.value.dueDate,
        // amountPaid: this.paymentApplicationForm.value.amountPaid,
        // interestAmount : this.paymentApplicationForm.value.interestAmount,
        // paymentMode :  this.paymentApplicationForm.value.paymentMode,
        // remarks : this.paymentApplicationForm.value.remarks,
        // // amountStatus: this.paymentApplicationForm.value.amountStatus,
        // amountStatus: 'paid',
        // disbursmentId: this.disbursmentId
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
    let dueAmountRaw = this.paymentApplicationForm.value.dueAmount;

    // Remove commas and decimal part
    let dueAmountCleaned = dueAmountRaw.replace(/,/g, '').split('.')[0]; // "16600"

    // Update the form control with the cleaned value (optional)
    this.paymentApplicationForm.get('dueAmount')?.setValue(dueAmountCleaned);
     let amountPaidRaw = this.paymentApplicationForm.value.amountPaid;

  // Remove commas and decimal part, then convert to number
  let amountPaidCleaned = Number(amountPaidRaw.replace(/,/g, '').split('.')[0]);

  // Update the form value if needed
  this.paymentApplicationForm.get('amountPaid')?.setValue(amountPaidCleaned);
    if (this.paymentApplicationForm.valid) {
      const paymentData = {
        paymentId: this.PaymentId,
        dueAmount: this.paymentApplicationForm.value.dueAmount,
        dueDate: this.paymentApplicationForm.value.dueDate,
        amountPaid: this.paymentApplicationForm.value.amountPaid,
        interestAmount: this.paymentApplicationForm.value.interestAmount,
        paymentMode: this.paymentApplicationForm.value.paymentMode,
        remarks: this.paymentApplicationForm.value.remarks,
        // amountStatus: this.paymentApplicationForm.value.amountStatus,
        amountStatus: 'paid',
        disbursmentId: this.disbursmentId
      };
      this.paymentService.updatePaymentmethod(paymentData).subscribe({
        next: (response: any) => {
          if (response.status === "success") {
            this.toast.success({
              detail: 'Success',
              summary: 'Payment Updated successfully.',
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
