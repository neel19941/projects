import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PersonalInfoComponent } from '../personal-info/personal-info.component';
import { ContactInfoComponent } from '../contact-info/contact-info.component';
import { AddressInfoComponent } from '../address-info/address-info.component';
import { ConfirmModalComponent } from 'src/app/core/models/confirm-modal/confirm-modal.component';
import { NgToastService } from 'ng-angular-popup';
import { CustomerService } from 'src/app/services/customer.service';
import { CustomerInfoComponent } from '../customer-info/customer-info.component';
import { PrivilegesService } from 'src/app/services/privileges.service';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';
import { AllCustomerDocumentsComponent } from '../all-customer-documents/all-customer-documents.component';

@Component({
  selector: 'app-customer-updation',
  standalone: true,
  imports: [CommonModule, PersonalInfoComponent, ContactInfoComponent, AddressInfoComponent, ConfirmModalComponent, CustomerInfoComponent , AllCustomerDocumentsComponent],
  templateUrl: './customer-updation.component.html',
  styleUrls: ['./customer-updation.component.scss']
})
export class CustomerUpdationComponent {

  @Output() closeModal: EventEmitter<void> = new EventEmitter();
  @Input() CustId!: number;
  Restrict = "restricted";
  showMainPopup = true;
  showPersonalModal = false;
  showContactModal = false;
  showAddressModal = false;
  showConfirmDialog = false;
  showAllCustomerDocsModal = false;
  customerToDelete: number | null = null;
  confirmMessage: string = '';
  private toast = inject(CustomToastService);
  constructor(private custServ: CustomerService) { }
  protected privilegeServ = inject(PrivilegesService);
  ngOnInit(): void {

  }
  // closeMainPopup(): void {
  //   this.showMainPopup = false;
  // }

  openPersonalModal(): void {
    this.showPersonalModal = true;
    this.showMainPopup = false;
  }

  closePersonalModal(): void {
    this.showPersonalModal = false;
    this.showMainPopup = true;
  }
  openAllCustomerDocsModal(){
this.showAllCustomerDocsModal = true;
this.showMainPopup = false;
  }

closeCustomerDocsPopup(){
  this.showAllCustomerDocsModal = false;
  this.showMainPopup = true;
}
  openContactPopup(): void {
    this.showContactModal = true;
    this.showMainPopup = false;
  }

  closeContactPopup(): void {
    this.showContactModal = false;
    this.showMainPopup = true;
  }

  openAddressPopup(): void {
    this.showAddressModal = true;
    this.showMainPopup = false;
  }

  closeAddressPopup(): void {
    this.showAddressModal = false;
    this.showMainPopup = true;
  }
  openDeleteConfirmation() {
    this.customerToDelete = this.CustId;
    this.confirmMessage = 'Are you sure you want to delete this customer?';
    this.showConfirmDialog = true;
    this.showMainPopup = false;
  }

  handleDeleteConfirmation(confirmed: boolean): void {
    this.showConfirmDialog = false;
    if (confirmed && this.customerToDelete !== null) {
      this.deleteCustomer(this.customerToDelete);
    } else {
      // Reopen the HRM Actions modal if the user cancels
      this.showMainPopup = true;
    }
  }
  deleteCustomer(customerId: number): void {
    this.custServ.deleteCustomer(customerId).subscribe({
      next: (res: any) => {
        if (res.status === 'success') {
          console.log('Customer deleted successfully', res);

          this.toast.success({
            detail: 'Success',
            summary: 'Customer deleted successfully',
            duration: 3000,
          });

          // Reload customers with the updated page index
          this.close();
        } else {
          // API responded, but deletion was not successful
          this.toast.error({
            detail: 'Error',
            summary: res.message || 'Failed to delete customer. Please try again.',
            duration: 3000,
          });
          this.close();
        }
      },
      error: (error: any) => {
        console.error('Error deleting customer', error);
        this.toast.error({
          detail: 'Error',
          summary: 'Failed to delete Customer . Please try again.',
          duration: 3000,
        });
      }
    });
  }

  // Close modal function
  close(): void {
    this.closeModal.emit();
  }
}
