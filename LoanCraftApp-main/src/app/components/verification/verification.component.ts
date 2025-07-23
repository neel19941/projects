import { Component, EventEmitter, inject, Output } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CapitalizePipe } from 'src/app/core/pipes/capitalize.pipe';
import { PhysicalVerifcationComponent } from '../physical-verifcation/physical-verifcation.component';
import { VerificationService } from 'src/app/services/verification.service';
import { NgToastService } from 'ng-angular-popup';
import { PrivilegesService } from 'src/app/services/privileges.service';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';

@Component({
  selector: 'app-verification',
  standalone: true,
  imports: [CommonModule, FormsModule, CapitalizePipe,TitleCasePipe, ReactiveFormsModule, PhysicalVerifcationComponent],
  templateUrl: './verification.component.html',
  styleUrls: ['./verification.component.scss']
})

export class VerificationComponent {
  loanId: number = 0;
  searchTerm: string = '';
  isDropdownOpen: boolean = false;
  selectedApplication: any = null;
  showPhysicalVerifyComponent = false;
  applications: any[] = [];
  filteredList: any[] = [];
  steps: any[] = [];
  itemObj!: any;
  private verifyServ = inject(VerificationService);
  protected privilegeServ = inject(PrivilegesService);
  private toast = inject(CustomToastService);

  ngOnInit() {
    this.getReviewedApplications();
  }
  // constructor(private titleCasePipe: TitleCasePipe){
    
  // }
  
  onSearchChange() {
    if (this.searchTerm) {
      this.filteredList = this.applications.filter(item =>
        item.firstName.toLowerCase().includes(this.searchTerm.toLowerCase()) || item.applicationReferenceId.toLowerCase().includes(this.searchTerm.toLowerCase())||
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
    this.verifyServ.getVerificationTrack(this.itemObj.loanid).subscribe({
      next: (response: any) => {
        if (response.status === "success") {
          const data = response.data;

          this.steps = [
            { label: 'Round for Review', verified: data.reviewed },
            { label: 'CBIL Verification', verified: data.cibil },  // Added CBIL Verification
            { label: 'Document Verification', verified: data.documentsVerified },
            { label: 'Physical Verification', verified: data.physicalLocationVerified },
            { label: 'Sanctioned', verified: data.sanction },
            { label: 'Disbursed', verified: data.disbursed }
          ];
        } else {
          this.toast.error({ detail: 'Error', summary: 'Not updated status', duration: 3000 });
          this.steps = [];
        }
      }
    });

    this.searchTerm =  this.toTitleCase(item.fullName) + (item.applicationReferenceId ? ` - ${item.applicationReferenceId}` : '') + (item.loanAccountNumber ? ` - ${item.loanAccountNumber}` : '');
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
  
  openPhysicalPopup() {
    const documentStep = this.steps.find(s => s.label === 'Document Verification');
    if (documentStep && documentStep.verified) {
      // Only if documents are verified, allow opening physical verification
      this.showPhysicalVerifyComponent = true;
    } else {
      // If documents are not verified, restrict and show a message
      this.toast.warning({ detail: 'Warning', summary: 'Please verify documents first.', duration: 3000 });
    }
  }
  
  closePhysicalVerification() {
    this.showPhysicalVerifyComponent = false;
    this.selectItem(this.itemObj);
  }
}
