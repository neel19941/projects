import { Component, EventEmitter, inject, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VerificationService } from 'src/app/services/verification.service';
import { PrivilegesService } from 'src/app/services/privileges.service';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';
import { ApplicationsService } from 'src/app/services/applications.service';

@Component({
  selector: 'app-all-customer-documents',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './all-customer-documents.component.html',
  styleUrls: ['./all-customer-documents.component.scss']
})
export class AllCustomerDocumentsComponent {

  title: string = 'All Customer Documents';

  @Output() closeModal: EventEmitter<void> = new EventEmitter();


  loanId: number = 0;
  restrictVerify: boolean = false;
  searchTerm: string = '';
  isDropdownOpen: boolean = false;
  selectedApplication: any = null;
  showPhysicalVerifyComponent = false;
  applications: any[] = [];
  physicalDocuments: any[] = [];
  filteredList: any[] = [];
  itemObj!: any;
  private verifyServ = inject(VerificationService);
  protected privilegeServ = inject(PrivilegesService);
  private toast = inject(CustomToastService);
  private applicationService = inject(ApplicationsService);

  ngOnInit() {
    this.getAllDocuments();
  }

  onSearchChange() {
    if (this.searchTerm) {
      this.filteredList = this.applications.filter(item =>
        item.firstName.toLowerCase().includes(this.searchTerm.toLowerCase()) || item.applicationReferenceId.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        (item.loanAccountNumber && item.loanAccountNumber.toLowerCase().includes(this.searchTerm.toLowerCase())) ||
        item.mobileNumber.includes(this.searchTerm)
      );
    } else {
      this.filteredList = [...this.applications];
    }
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }


  getReviewedApplications() {
    this.verifyServ.getReviewedApplications().subscribe({
      next: (response: any) => {
        if (response.status === 'success' && response.data) {
          this.applications = response.data;
          this.filteredList = [...this.applications];
        }
      },
      error: (err) => {
        console.error('Error fetching applications:', err);
      }
    });
  }

  selectItem(item: any) {
    this.itemObj = item;
    this.loanId = item.loanid;

    // Reset restrictVerify initially to false
    this.restrictVerify = false;

    // this.verifyServ.getVerificationTrack(this.itemObj.loanid).subscribe({
    //   next: (response: any) => {
    //     if (response.status === "success") {
    //       if (response.data.documentsVerified === true) {
    //         this.restrictVerify = true;
    //       } else {
    //         this.toast.error({ detail: 'Error', summary: 'Please verify the document to continue.', duration: 3000 });
    //       }
    //     }
    //     // else {
    //     //   this.toast.error({ detail: 'Error', summary: 'Not updated status', duration: 3000 });
    //     // }
    //   }
    // });
    // alert(this.loanId);


    this.searchTerm = this.toTitleCase(item.firstName) + (item.applicationReferenceId ? ` - ${item.applicationReferenceId}` : '') + (item.loanAccountNumber ? ` - ${item.loanAccountNumber}` : '');
    this.isDropdownOpen = false;
  }
  toTitleCase(value: string): string {
    if (!value) return '';
    return value
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
  getUserId(){
    return localStorage.getItem("customerId");
  }

  
  getAllDocuments() {
    const customerId = this.getUserId();
    this.verifyServ.getAllCustomerDocuments(customerId).subscribe({
      next: (response: any) => {
        if (response && response.data && Array.isArray(response.data)) {
          // alert("condtion 0");
          this.physicalDocuments = response.data;
        } else {
          this.physicalDocuments = [];
          // alert("condtion 1");
        }
      },
      error: (err) => {
        this.toast.error({ detail: 'Error', summary: 'Not Fetched Data', duration: 3000 });
        // alert("condtion 2");
      }
    });
  }
  // openPhysicalPopup() {
  //   this.showPhysicalVerifyComponent = true;
  // }

  // closePhysicalVerification() {
  //   this.showPhysicalVerifyComponent = false;
  //   this.selectItem(this.itemObj);
  // }

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
        link.download = 'document'; // optionally customize filename
        link.click();
        URL.revokeObjectURL(fileURL);
      },
      error: (error) => {
        console.error('Error downloading document:', error);
        this.toast.error({ detail: 'Error', summary: 'Could not download document', duration: 3000 });
      }
    });
  }

  getVerify(doc: any, status: boolean): void {
    this.verifyServ.verifyDocument(doc.id, status).subscribe({
      next: (response: any) => {
        doc.docVerified = status;
        this.toast.success({ detail: 'Success', summary: `Document ${status ? 'accepted' : 'rejected'}`, duration: 3000 });
      },
      error: (err) => {
        console.error('Verification failed:', err);
        this.toast.error({ detail: 'Error', summary: 'Verification failed', duration: 3000 });
      }
    });
  }

  close(): void {
    this.closeModal.emit();
  }
}
