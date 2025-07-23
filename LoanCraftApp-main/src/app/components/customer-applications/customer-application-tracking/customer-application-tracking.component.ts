import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VerificationService } from 'src/app/services/verification.service';
import { NgToastService } from 'ng-angular-popup';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';

@Component({
  selector: 'app-customer-application-tracking',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './customer-application-tracking.component.html',
  styleUrls: ['./customer-application-tracking.component.scss']
})
export class CustomerApplicationTrackingComponent {
  @Output() closeModal: EventEmitter<void> = new EventEmitter();
  @Input() LoanId!: number;
  private verifyServ = inject(VerificationService);
  private toast = inject(CustomToastService);
  steps: any[] = [];
  ngOnInit() {
       this.selectItem();
  }

  openPhysicalPopup(){}

  selectItem() {
    this.verifyServ.getVerificationTrack(this.LoanId).subscribe({
      next: (response: any) => {
        if (response.status === "success") {
          const data = response.data;

          this.steps = [
            { label: 'Round for Review', verified: data.reviewed },
            { label: 'CBIL Verification', verified: data.cibil },  // Added CBIL Verification
            { label: 'Document Verification', verified: data.documentsVerified },
            { label: 'Physical Verification', verified: data.physicalLocationVerified },
            { label: 'Sanction Verification', verified: data.sanction },
            { label: 'Disbursed', verified: data.disbursed }
          ];
        } else {
          this.toast.error({ detail: 'Error', summary: 'Not updated status', duration: 3000 });
        }
      }
    });
  }

  close(): void {
    this.closeModal.emit();
  }
  
}
