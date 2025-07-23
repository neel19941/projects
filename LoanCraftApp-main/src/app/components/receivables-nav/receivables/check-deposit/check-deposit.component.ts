import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoanSanctionService } from 'src/app/services/loan-sanction.service';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';
import { PaymentsService } from 'src/app/services/payments.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbDatepickerModule, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { CapitalizePipe } from 'src/app/core/pipes/capitalize.pipe';
import { DetailedEmiInfoComponent } from '../detailed-emi-info/detailed-emi-info.component';
import { ChequeDepositRequestComponent } from '../cheque-deposit-request/cheque-deposit-request.component';

@Component({
  selector: 'app-check-deposit',
  standalone: true,
  imports: [CommonModule, FormsModule, CapitalizePipe, ReactiveFormsModule, DetailedEmiInfoComponent, ChequeDepositRequestComponent, NgbDatepickerModule],
  templateUrl: './check-deposit.component.html',
  styleUrls: ['./check-deposit.component.scss']
})
export class CheckDepositComponent {
  @Output() closeModal: EventEmitter<void> = new EventEmitter();
  // @Input() disbursedId!: number;
  @Input() mode!: string;
  @Input() chequeId!: number;
  checkBounceForm!: FormGroup;
  receivablesList: any[] = [];
  filteredList: any[] = [];
  recievablesAmount: any;
  searchTerm: string = '';
  isDropdownOpen: boolean = false;
  disbursedId: any;
  repaymentId: any;
  repayId: any;
  private data: any;
  itemObj!: any;
  loanAccNumber: any;
  receivableAmount: any;
  requestedAmount: any;
  // showChequeNumber = true;
  showEmiDetailedInfoComponent = false;
  showChequeDepositRequest = false;
  isAmountLessThanReceivable: boolean = false;



  title: string = 'Cheque Deposit';
  reasonOptions = [
    { label: 'Insufficient Funds', value: 'Insufficient Funds' },
    // { label: 'Signature Mismatch', value: 'Signature Mismatch' },
    { label: 'Account Closed', value: 'Account Closed' },
    { label: 'Technical Error', value: 'Technical Error' },
    { label: 'Exceeds Arrangement', value: 'Exceeds Arrangement' },
    { label: 'Refer To Drawer', value: 'Refer To Drawer' },
    { label: "Drawer's Signature Differs", value: "Drawer's Signature Differs" },
    { label: 'Wrongly Delivered/Not Drawn On Us', value: 'Wrongly Delivered/Not Drawn On Us' },
    { label: "Alteration Requires Drawer's Authentication", value: "Alteration Requires Drawer's Authentication" },
    { label: "Present In Proper Zone", value: "Present In Proper Zone" },
    { label: "Effects Not Cleared, Present Again", value: "Effects Not Cleared, Present Again" },
    { label: "Payment Stopped By Drawer", value: "Payment Stopped By Drawer" },
    { label: "Account Blocked", value: "Account Blocked" },
    { label: 'Other Reasons', value: 'Other Reasons' },
    // { label: 'Other', value: 'Other' }
  ];

  isSubmitButtonEnabled: boolean = false;

  showRequestButton: boolean = true;

  private sanctionService = inject(LoanSanctionService);
  private toast = inject(CustomToastService);
  private paymentsService = inject(PaymentsService);
  // resasonField = false;
  isEditMode: boolean = false;  // By default, it's add mode
  showReasonField = true;

  ApprovalState: any;
  reqAmount: any;
  EmiData: {
    loanAmount: number;
    outstanding: number;
    principal: number;
    interest: number;
    numberOfEmisDue: number;
    repaid: number;
    dueDate: string;
    emiDueAmount: number;
    totalDue: number;
    totalPenalty: number;
    lastPaidDate: any;
    emiDueInfo: {
      emiNumber: number;
      dueDate: string;
      dueDays: number;
      dueAmount: number;
      penalty: number;
      emiMonth: string;
    }[];
  } | null = null;
  eachEmi: any[] = [];
  emiDueDetails: any[] = [];
  fromDate!: NgbDateStruct;
  toDate!: NgbDateStruct;
  minDate!: NgbDateStruct;
  maxDate!: NgbDateStruct;
  searchEmiTerm: string = '';
  isEmiDropdownOpen: boolean = false;
  filteredEmiList: any[] = [];
  selectedEmi: any = null; // to store the selected EMI

  constructor(private fb: FormBuilder) { }
  // chequeNumber: ['', Validators.required],
  // chequeNumber: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
  ngOnInit() {
    if (this.mode === 'update' && this.chequeId) {
      this.title = "Update Cheque Deposit",
        // this.resasonField = true;
        this.loadSingleItem();
      this.isEditMode = true;
    }
    this.fetchReceivables();
    this.checkBounceForm = this.fb.group({


      chequeNumber: ['', [Validators.required, Validators.pattern('^\\d{6}$')]],
      postingDate: ['', Validators.required],
      amount: ['', [Validators.required, Validators.pattern('^[0-9,]+$'), Validators.min(1)]],
      reason: ['', Validators.required],
      remarks: [''],
      status: ['', Validators.required],
    });

    //   // 👇 Subscribe to status changes
    // this.checkBounceForm.get('status')?.valueChanges.subscribe(status => {
    //   const reasonControl = this.checkBounceForm.get('reason');
    //   if (status === 'Cleared') {
    //     this.showReasonField = false;
    //     reasonControl?.setValue('-'); // Set value
    //   } 
    //   else {
    //     this.showReasonField = true;
    //      reasonControl?.setValue(''); // Clear previous value
    //   }
    //   reasonControl?.updateValueAndValidity();
    // });

    // 👇 Subscribe to status changes
    this.checkBounceForm.get('status')?.valueChanges.subscribe(status => {
      const reasonControl = this.checkBounceForm.get('reason');

      if (reasonControl) {
        if (status === 'Cleared') {
          this.showReasonField = false;
          reasonControl.setValue('-');
          reasonControl.clearValidators();
        } else {
          this.showReasonField = true;

          if (reasonControl.value === '-') {
            reasonControl.setValue('');
            reasonControl.setValidators([Validators.required]);
          }


        }

        reasonControl.updateValueAndValidity();
      }
    });
  }

  fetchReceivables() {
    this.sanctionService.getDisbursedCustomerDetails().subscribe(
      (response: any) => {
        if (response.status === 'success' && response.data) {
          this.receivablesList = response.data;
          this.filteredList = [...this.receivablesList];
        }
      },
      (error) => {
        console.error('Error fetching receivables:', error);
      }
    );
  }

  //   onChequeNumberInput() {
  //   this.showChequeNumber = true;

  //   // Hide input after 1 second of typing
  //   setTimeout(() => {
  //     this.showChequeNumber = false;
  //   }, 1000);
  // }
  formatIndianCurrency(value: any): string {
    if (!value) return '';
    // Convert number to string and format it in the Indian number system
    return new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(Number(value));
  }

  loadSingleItem() {
    if (!this.chequeId) {
      console.error('Cheque Id not found.');
      return;
    }

    this.paymentsService.getRoleById(this.chequeId).subscribe({
      next: (response: any) => {
        if (response?.status === 'success' && response?.data) {
          this.data = response.data;
          this.populateForm(this.data);
        } else {
          console.error('Invalid response format or no data returned');
        }
      },
      error: (error) => {
        console.error('Error fetching cheque data:', error);
      }
    });
  }
  // ✅ Updated to use actual field names from response
  private populateForm(data: any): void {
    console.log(data);
    const ngbDate = this.convertToNgbDate(data.postingDate);
    this.checkBounceForm.patchValue({
      chequeNumber: data.chequeNumber || '',
      postingDate: ngbDate,
      amount: data.amount?.toLocaleString('en-IN') || '',
      reason: data.reason || '',
      // recievableAmount : data.recievableAmount || '',
      remarks: data.remarks || '',
      // disbursmentId : data.disbursmentId || 0,
      status: data.status || ''
    });
    this.recievablesAmount = data.recievableAmount;
    this.disbursedId = data.disbursment.disbursmentId;
    this.repaymentId = data.repaymentId;
  }
  private convertToNgbDate(dateStr: string): NgbDateStruct | null {
    if (!dateStr) return null;
    const [year, month, day] = dateStr.split('-').map(Number);
    return { year, month, day };
  }


  onSearchChange() {
    if (this.searchTerm) {
      this.filteredList = this.receivablesList.filter(item =>
        item.fullName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        (item.loanAccountNumber && item.loanAccountNumber.toLowerCase().includes(this.searchTerm.toLowerCase())) ||
        item.mobileNumber.includes(this.searchTerm)
      );
    } else {
      this.filteredList = [...this.receivablesList];
    }
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  onEmiSearchChange() {
    const term = this.searchEmiTerm.toLowerCase();
    this.filteredEmiList = this.eachEmi.filter(item =>
      item.emiMonth.toLowerCase().includes(term)
    );
  }

  toggleEmiDropdown() {
    this.isEmiDropdownOpen = !this.isEmiDropdownOpen;
  }




  // selectEmiItem(item: any) {
  //   this.selectedEmi = item;
  //   this.searchEmiTerm = item.emiMonth;
  //   this.isEmiDropdownOpen = false;
  //   this.repayId = item.repaymentId;
  //   this.ApprovalState = item.isApproved;
  //   this.reqAmount = item.requestedAmount;
  // // alert(this.ApprovalState);
  //   console.log('Selected EMI:', item);

  //   if (this.isAmountLessThanReceivable) {
  //     if (this.ApprovalState === true) {
  //       // Case 1: Approval true, check reqAmount vs requestedAmount
  //       if (this.reqAmount === this.requestedAmount) {
  //         this.showRequestButton = true;
  //       } else {
  //         // reqAmount !== requestedAmount
  //         // "you already reset your requested amount is this.reqAmount" 
  //         // so disable submit?
  //                     this.toast.success({
  //               detail: 'Success',
  //               summary: 'you already requseted and your requested amount is'+""+ this.reqAmount,
  //               duration: 4000
  //             });

  //         this.showRequestButton = false;
  //       }
  //     } else if (this.ApprovalState === false) {
  //       // Case 2: Approval false and amount less than receivable
  //       this.showRequestButton = false;
  //     } else {
  //       // If ApprovalState is neither true nor false (unlikely)
  //       this.showRequestButton = false;
  //     }
  //   } else {
  //     // Case 3: amount NOT less than receivable
  //     this.showRequestButton = true;
  //   }
  // }

  mergeInputmethods(data: any, edit: any) {
    this.formatAmountForDisplay(data);
    this.checkLoanSelected(edit);
  }
  // checkLoanSelected(data: any) {
  //   if (!data && (!this.selectedEmi || this.selectedEmi === null)) {
  //     this.toast.error({
  //       detail: 'Error',
  //       summary: 'Please select a loan first.',
  //       duration: 3000
  //     });
  //     this.checkBounceForm.get('amount')?.reset(); // Clear field cleanly
  //     this.repayId.reset();
  //   }
  // }

  checkLoanSelected(data: any) {
    const hasSelectedEmi = this.selectedEmi && this.selectedEmi.repaymentId;
    if (!data || !hasSelectedEmi) {
      this.toast.error({
        detail: 'Error',
        summary: 'Please select Loan & EMI Month before entering amount.',
        duration: 4000
      });
      this.checkBounceForm.get('amount')?.reset();
      this.repayId = null;
    }
  }


  formatAmountForDisplay(fieldName: string) {
    let value = this.checkBounceForm.get(fieldName)?.value;

    if (value) {
      // Remove all non-digit characters
      value = value.replace(/[^0-9]/g, '');

      if (value) {
        // Format number with Indian commas
        const formatted = parseInt(value, 10).toLocaleString('en-IN');
        this.checkBounceForm.patchValue({ [fieldName]: formatted }, { emitEvent: false });
      }
    }
  }

  getId() {
    return localStorage.getItem("userId");
  }

  openEmiPopup() {
    this.showEmiDetailedInfoComponent = true;
    // this.disbursedId = id;
  }
  closeEmiPopup() {
    this.showEmiDetailedInfoComponent = false;
    // this.selectItem(this.itemObj);
  }

  openChequeDepositRequest() {
    this.showChequeDepositRequest = true;
  }

  closeChequeDepositRequest() {
    this.showChequeDepositRequest = false;
    this.close();
  }

  sendData() {
    if (!this.disbursedId) {
      this.toast.error({
        detail: 'Error',
        summary: 'Please select a loan first.',
        duration: 3000
      });
      return;
    }

    // In Add Mode, validate EMI selection and skip reason/status validators
    if (!this.isEditMode) {
      if (!this.selectedEmi || !this.selectedEmi.repaymentId) {
        this.toast.error({
          detail: 'Error',
          summary: 'Please select an EMI month.',
          duration: 3000
        });
        return;
      }

      // Clear validators for 'reason' and 'status'
      // this.checkBounceForm.get('reason')?.clearValidators();
      // this.checkBounceForm.get('status')?.clearValidators();
      // this.checkBounceForm.get('reason')?.updateValueAndValidity();
      // this.checkBounceForm.get('status')?.updateValueAndValidity();
      this.checkBounceForm.get('reason')?.clearValidators();
      this.checkBounceForm.get('status')?.clearValidators();

      this.checkBounceForm.get('reason')?.setValue('');
      this.checkBounceForm.get('status')?.setValue(''); // Or a default if required

      this.checkBounceForm.get('reason')?.updateValueAndValidity();
      this.checkBounceForm.get('status')?.updateValueAndValidity();

    }

    if (this.checkBounceForm.valid) {
      const postingDateStruct = this.checkBounceForm.value.postingDate;
      const formattedDate = `${postingDateStruct.year}-${String(postingDateStruct.month).padStart(2, '0')}-${String(postingDateStruct.day).padStart(2, '0')}`;

      const Obj: any = {
        chequeNumber: this.checkBounceForm.value.chequeNumber,
        postingDate: formattedDate,
        amount: this.checkBounceForm.value.amount.replace(/,/g, ''),
        remarks: this.checkBounceForm.value.remarks,
        disbursmentId: this.disbursedId,
        recievableAmount: this.EmiData?.totalDue || 0,
        addedBy: this.getId()
      };

      // Add repaymentId in Add Mode
      if (!this.isEditMode) {
        Obj.repaymentId = this.selectedEmi.repaymentId;
      }

      this.paymentsService.postChequeDeposit(Obj).subscribe({
        next: (response: any) => {
          if (response.status === "success") {
            this.toast.success({
              detail: 'Success',
              summary: 'Cheque Deposit saved successfully.',
              duration: 3000
            });
            this.close();
          } else {
            this.toast.error({
              detail: 'Error',
              summary: 'Failed to save Cheque Deposit. ' + response.message,
              duration: 3000
            });
            this.close();
          }
        },
        error: (error) => {
          console.error('Error saving Cheque Deposit', error);
          this.toast.error({
            detail: 'Error',
            summary: 'Failed to save Cheque Deposit',
            duration: 3000
          });
        }
      });
    } else {
      this.checkBounceForm.markAllAsTouched();
    }
  }


  updateData() {
    if (this.isEditMode) {
      //     // Skip validation for all fields except 'reason' and 'status'
      this.checkBounceForm.get('chequeNumber')?.clearValidators();
      this.checkBounceForm.get('postingDate')?.clearValidators();
      this.checkBounceForm.get('amount')?.clearValidators();
      this.checkBounceForm.get('remarks')?.clearValidators();

      this.checkBounceForm.get('chequeNumber')?.updateValueAndValidity();
      this.checkBounceForm.get('postingDate')?.updateValueAndValidity();
      this.checkBounceForm.get('amount')?.updateValueAndValidity();
      this.checkBounceForm.get('remarks')?.updateValueAndValidity();

      // Ensure 'reason' and 'status' are validated
      this.checkBounceForm.get('reason')?.setValidators([Validators.required]);
      this.checkBounceForm.get('status')?.setValidators([Validators.required]);
      this.checkBounceForm.get('reason')?.updateValueAndValidity();
      this.checkBounceForm.get('status')?.updateValueAndValidity();

      //  Block if status is 'Posted'
      if (this.checkBounceForm.value.status === 'Posted') {
        this.checkBounceForm.get('status')?.setErrors({ invalidStatus: true });
        this.checkBounceForm.get('status')?.markAsTouched();
        return;
      }
    }

    if (this.checkBounceForm.valid) {
      const Obj = {
        id: this.chequeId,
        status: this.checkBounceForm.value.status,
        reason: this.checkBounceForm.value.reason,
        userid: this.getId()
      };
      this.paymentsService.updateChequeDepositStatus(Obj.id, Obj.status, Obj.reason, Obj.userid).subscribe({
        next: (response: any) => {
          if (response.status === "success") {
            this.toast.success({
              detail: 'Success',
              summary: 'Cheque Deposit updated successfully.',
              duration: 3000
            });
            this.close();
          } else {
            this.toast.error({
              detail: 'Error',
              summary: 'Failed to update Cheque Deposit. ' + response.message,
              duration: 3000
            });
          }
        },
        error: (error) => {
          console.error('Error updating Cheque Deposit', error);
          this.toast.error({
            detail: 'Error',
            summary: 'Failed to update Cheque Deposit',
            duration: 3000
          });
          this.close();
        }
      });
    } else {
      this.checkBounceForm.markAllAsTouched();
    }
  }


  // onAmountChange(data: any): void {
  //   const rawAmount = this.checkBounceForm.get('amount')?.value;
  //   if (!rawAmount || !data) {
  //     this.isAmountLessThanReceivable = false;
  //     return;
  //   }
  //   const numericAmount = parseFloat(rawAmount.toString().replace(/,/g, ''));
  //   const receivableAmount = parseFloat(data.toString());
  //   // alert(numericAmount);
  //   // alert(receivableAmount);
  //   this.isAmountLessThanReceivable = numericAmount < receivableAmount;
  //   this.requestedAmount = numericAmount;

  //   if (this.isAmountLessThanReceivable && !this.ApprovalState) {
  //     // alert("it's working");
  //     // this.showChequeDepositRequest = true;
  //     this.showRequestButton = false;
  //   } else {
  //     this.showRequestButton = true;
  //   }
  // }

  onAmountChange(receivable: any): void {

    const rawAmount = this.checkBounceForm.get('amount')?.value;

    if (!rawAmount || !receivable) {
      this.isAmountLessThanReceivable = false;
      this.isSubmitButtonEnabled = false;
      this.showRequestButton = true;
      return;
    }

    const numericAmount = parseFloat(rawAmount.toString().replace(/,/g, ''));
    const receivableAmount = parseFloat(receivable.toString());

    this.isAmountLessThanReceivable = numericAmount < receivableAmount;
    this.requestedAmount = numericAmount;

    let alreadyRequested = false;
    let isApproved = false;

    if (this.selectedEmi?.requestedAmount?.length) {
      for (const req of this.selectedEmi.requestedAmount) {
        if (req.requstedAmount === numericAmount) {
          alreadyRequested = true;
          isApproved = req.isApproved;
          break;
        }
      }
    }

    // === RULE 1: Amount is less, already requested, and not approved ===
    if (this.isAmountLessThanReceivable && alreadyRequested && !isApproved) {
      this.toast.warning({
        detail: 'Info',
        summary: 'You already requested this amount but not approved.',
        duration: 3000
      });
      this.showRequestButton = true;
      this.isSubmitButtonEnabled = true;
      return;
    }

    // === RULE 2: Amount is less, not already requested ===
    if (this.isAmountLessThanReceivable && !alreadyRequested) {
      this.showRequestButton = false;
      this.isSubmitButtonEnabled = true;
      return;
    }

    // === RULE 3: Amount is less, already approved ===
    if (this.isAmountLessThanReceivable && alreadyRequested && isApproved) {
      this.showRequestButton = true;
      this.isSubmitButtonEnabled = false;
      return;
    }

    // === RULE 4: Normal scenario ===
    this.showRequestButton = true;
    this.isSubmitButtonEnabled = false;
  }


  selectItem(item: any) {
    this.itemObj = item;
    this.loanAccNumber = item.loanAccountNumber;
    this.disbursedId = item.disbursmentId;
    this.paymentsService.getEmiInfo(item.disbursmentId).subscribe({
      next: (response: any) => {
        this.EmiData = response.data; // Directly assign the object
        this.emiDueDetails = response.data.emiDueInfo || []; // <-- extract emiDueInfo
        this.receivableAmount = this.EmiData?.totalDue;
        this.toast.success({
          detail: 'Success',
          summary: 'Details Fetched successfully.',
          duration: 3000
        });
      },
      error: (error) => {
        console.error('Error fetching EMI Info:', error);
        this.EmiData = null;
        this.emiDueDetails = []; // clear on error
        this.toast.error({
          detail: 'Error',
          summary: 'Failed to get Details.',
          duration: 3000
        });
      }
    });

    this.searchTerm = item.fullName + (item.loanAccountNumber ? ` - ${item.loanAccountNumber}` : '');
    this.isDropdownOpen = false;

    this.paymentsService.getEmiMonths(item.disbursmentId).subscribe({
      next: (response: any) => {
        this.eachEmi = response.data.map((item: any) => ({
          repaymentId: item.repaymentId,
          emiMonth: item.dueMonthYear.trim(),
          isApproved: item.isApproved,
          requestedAmount: item.requests
        }));
        this.filteredEmiList = [...this.eachEmi]; // initial filtered list
        this.toast.success({
          detail: 'Success',
          summary: 'EMI Details Fetched successfully.',
          duration: 3000
        });
      },
      error: (error) => {
        console.error('Error fetching EMI Info:', error);
        this.eachEmi = [];
        this.filteredEmiList = [];
        this.toast.error({
          detail: 'Error',
          summary: 'Failed to get Details.',
          duration: 3000
        });
      }
    });
  }
  selectEmiItem(item: any) {
    this.checkBounceForm.get('amount')?.reset();
    this.selectedEmi = item;
    this.searchEmiTerm = item.emiMonth;
    this.isEmiDropdownOpen = false;
    this.repayId = item.repaymentId;
    this.ApprovalState = item.isApproved;
    this.reqAmount = item.requestedAmount;
    // alert(JSON.stringify(item));
    // alert(this.repayId);
    // Optionally store the repaymentId for sendData later
    console.log('Selected EMI:', item);
    if (this.isAmountLessThanReceivable && !this.ApprovalState) {
      // alert("it's working");
      // this.showChequeDepositRequest = true;
      this.showRequestButton = false;
    } else {
      this.showRequestButton = true;
    }
  }

  close(): void {
    this.closeModal.emit();
  }

  // toTitleCase(value: string): string {
  //   if (!value) return '';
  //   return value
  //     .toLowerCase()
  //     .split(' ')
  //     .map(word => word.charAt(0).toUpperCase() + word.slice(1))
  //     .join(' ');
  // }






  // updateData() {
  //   if (this.isEditMode) {
  //     // Skip validation for all fields except 'reason' and 'status'
  //     this.checkBounceForm.get('chequeNumber')?.clearValidators();
  //     this.checkBounceForm.get('postingDate')?.clearValidators();
  //     this.checkBounceForm.get('amount')?.clearValidators();
  //     this.checkBounceForm.get('remarks')?.clearValidators();

  //     this.checkBounceForm.get('chequeNumber')?.updateValueAndValidity();
  //     this.checkBounceForm.get('postingDate')?.updateValueAndValidity();
  //     this.checkBounceForm.get('amount')?.updateValueAndValidity();
  //     this.checkBounceForm.get('remarks')?.updateValueAndValidity();

  //     // Ensure 'reason' and 'status' are validated
  //     this.checkBounceForm.get('reason')?.setValidators([Validators.required]);
  //     this.checkBounceForm.get('status')?.setValidators([Validators.required]);
  //     this.checkBounceForm.get('reason')?.updateValueAndValidity();
  //     this.checkBounceForm.get('status')?.updateValueAndValidity();
  //   }

  //   if (this.checkBounceForm.valid) {
  //     const postingDateStruct = this.checkBounceForm.value.postingDate;
  //     const formattedDate = `${postingDateStruct.year}-${String(postingDateStruct.month).padStart(2, '0')}-${String(postingDateStruct.day).padStart(2, '0')}`;

  //     const Obj = {
  //       id: this.chequeId,
  //       chequeNumber: this.checkBounceForm.value.chequeNumber,
  //       postingDate: formattedDate,
  //       amount: this.checkBounceForm.value.amount.replace(/,/g, ''),
  //       reason: this.checkBounceForm.value.reason,
  //       recievableAmount: this.recievablesAmount,
  //       remarks: this.checkBounceForm.value.remarks,
  //       disbursmentId: this.disbursedId,
  //       repaymentId : this.repaymentId,
  //       status: this.checkBounceForm.value.status
  //     };
  //     // alert(JSON.stringify(Obj)); 
  //     this.paymentsService.updateChequeDeposit(Obj).subscribe({
  //       next: (response: any) => {
  //         if (response.status === "success") {
  //           this.toast.success({
  //             detail: 'Success',
  //             summary: 'Cheque Deposit updated successfully.',
  //             duration: 3000
  //           });
  //           this.close();
  //         } else {
  //           this.toast.error({
  //             detail: 'Error',
  //             summary: 'Failed to update Cheque Deposit. ' + response.message,
  //             duration: 3000
  //           });
  //         }
  //       },
  //       error: (error) => {
  //         console.error('Error updating Cheque Deposit', error);
  //         this.toast.error({
  //           detail: 'Error',
  //           summary: 'Failed to update Cheque Deposit',
  //           duration: 3000
  //         });
  //         this.close();
  //       }
  //     });
  //   } else {
  //     this.checkBounceForm.markAllAsTouched();
  //   }
  // }

  // onReceiptDateChange(): void {
  //   const date = this.paymentForm.get('receiptDate')?.value;
  //   if (date) {
  //     const formatted = `${date.year}-${date.month.toString().padStart(2, '0')}-${date.day.toString().padStart(2, '0')}`;

  //     this.paymentsService.getEmiInfoByDate(this.disbursedId, formatted).subscribe({
  //       next: (response: any) => {
  //         this.EmiData = response.data; // Directly assign the object
  //         this.toast.success({
  //           detail: 'Success',
  //           summary: 'Details Fetched successfully.',
  //           duration: 3000
  //         });
  //       },
  //       error: (error) => {
  //         console.error('Error fetching EMI Info:', error);
  //         this.EmiData = null;
  //         this.toast.error({
  //           detail: 'Error',
  //           summary: 'Failed to get Details.',
  //           duration: 3000
  //         });
  //       }
  //     });
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
}
