import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApplicationsService } from 'src/app/services/applications.service';
import { NgToastService } from 'ng-angular-popup';
import { VerificationService } from 'src/app/services/verification.service';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';

@Component({
  selector: 'app-verify-documents',
  standalone: true,
  imports: [CommonModule , FormsModule, ],
  templateUrl: './verify-documents.component.html',
  styleUrls: ['./verify-documents.component.scss']
})
export class VerifyDocumentsComponent {
  @Input() LoanId!: number;
  @Output() closeModal: EventEmitter<void> = new EventEmitter();
  
  constructor(private applicationService: ApplicationsService, private toast: CustomToastService) { }
  title: string = 'Documents Verification';
  isVerified: boolean = false;
  approveEnabled = false;
  rejectEnabled = false;
  private verifyServ = inject(VerificationService);

  documents: { 
    aadhaar: any[], 
    pan: any[], 
    payslips: any[], 
    bankStatements: any[], 
    otherDocs: any[]
  } = { 
    aadhaar: [], 
    pan: [], 
    payslips: [], 
    bankStatements: [], 
    otherDocs: [] 
  };

  ngOnInit(): void {
    this.getDocuments();
  }

  viewDocument(id: number): void {
    this.applicationService.viewOrDownloadFile(id).subscribe({
      next: (fileBlob: Blob) => {
        const fileURL = URL.createObjectURL(fileBlob);
        window.open(fileURL, '_blank');
      },
      error: (error) => {
        console.error('Error viewing document:', error);
        this.toast.error({ detail: 'Error', summary: 'Could not open document', duration: 3000 });
      }
    });
  }

  downloadDocument(id: number): void {
    this.applicationService.viewOrDownloadFile(id).subscribe({
      next: (fileBlob: Blob) => {
        const fileURL = URL.createObjectURL(fileBlob);
        const link = document.createElement('a');
        link.href = fileURL;
        link.download = 'document'; // optionally: pass filename from doc object
        link.click();
        URL.revokeObjectURL(fileURL);
      },
      error: (error) => {
        console.error('Error downloading document:', error);
        this.toast.error({ detail: 'Error', summary: 'Could not download document', duration: 3000 });
      }
    });
  }
  
  close(): void {
    this.closeModal.emit();
  }

  // evaluateButtonStates(): void {
  //   // Enable Approve only if all documents are accepted (true)
  //   this.approveEnabled = this.documents.length > 0 && this.documents.every(doc => doc.docVerified === true);
  
  //   // Enable Reject only if every document has a decision (either true or false)
  //   this.rejectEnabled = this.documents.length > 0 && this.documents.every(doc => doc.docVerified !== null && doc.docVerified !== undefined);
  // }
  evaluateButtonStates(): void {
    // Flatten the documents
    const allDocuments = [
      ...this.documents.aadhaar,
      ...this.documents.pan,
      ...this.documents.payslips,
      ...this.documents.bankStatements,
      ...this.documents.otherDocs
    ];
  
    // Enable Approve only if all documents are accepted (true)
    this.approveEnabled = allDocuments.length > 0 && allDocuments.every(doc => doc.docVerified === true);
  
    // Enable Reject only if every document has a decision (either true or false)
    this.rejectEnabled = allDocuments.length > 0 && allDocuments.every(doc => doc.docVerified !== null && doc.docVerified !== undefined);
  }
  

   getDocuments(): void {
    this.applicationService.getLoanDocuments(this.LoanId).subscribe({
      next: (response: any) => {
        this.documents = response.data;
        this.evaluateButtonStates();
      },
      error: (error) => {
        console.error('Error fetching documents:', error);
        this.toast.error({
          detail: 'Error',
          summary: 'Failed to load documents',
          duration: 3000
        });
      }
    });
  }
  Reject(){
  // alert(this.remarks);
  const feedbackObj = {
    status: 'rejected',
    // remarks: this.remarks,
    loanId: this.LoanId,
    // cbilScore: this.cbilScore
  };
  this.applicationService.reviewStatus(feedbackObj).subscribe({
    next: () => {
      this.toast.success({ detail: 'Success', summary: 'Application Rejected', duration: 3000 });
      this.close();
    },
    error: () => {
      this.toast.error({ detail: 'Error', summary: 'Something went wrong', duration: 3000 });
    }
  });
  }
  Approve(): void {
   const feedbackObj = {
      status: "Approved",
      // remarks: this.remarks,
      loanId: this.LoanId,
      // cbilScore: this.cbilScore
    }
    this.applicationService.reviewStatus(feedbackObj).subscribe({
      next: () => {
        this.toast.success({ detail: 'Success', summary: 'Application Approved', duration: 3000 });
        this.close();
      },
      error: () => {
        this.toast.error({ detail: 'Error', summary: 'Something went wrong', duration: 3000 });
      }
    });
  }

  // getVerify(id: number, status: boolean): void {
  //   this.verifyServ.verifyDocument(id, status).subscribe({
  //     next: (response: any) => {
  //       // Update only the affected document locally
  //       const doc = this.documents.find(d => d.id === id);
  //       if (doc) {
  //         doc.docVerified = status;
  //       }
  
  //       this.evaluateButtonStates(); // Recalculate approve/reject button states
  
  //       console.log('Document verification updated:', response);
  //     },
  //     error: (err) => {
  //       console.error('Verification failed:', err);
  //     }
  //   });
  // }
  getVerify(id: number, status: boolean): void {
    // Flatten the documents
    const allDocuments = [
      ...this.documents.aadhaar,
      ...this.documents.pan,
      ...this.documents.payslips,
      ...this.documents.bankStatements,
      ...this.documents.otherDocs
    ];
  
    // Find the document by ID
    const doc = allDocuments.find(d => d.id === id);
  
    if (doc) {
      this.verifyServ.verifyDocument(id, status).subscribe({
        next: (response: any) => {
          // Update only the affected document locally
          doc.docVerified = status;
  
          this.evaluateButtonStates(); // Recalculate approve/reject button states
  
          console.log('Document verification updated:', response);
        },
        error: (err) => {
          console.error('Verification failed:', err);
        }
      });
    }
  }
  
}    


 