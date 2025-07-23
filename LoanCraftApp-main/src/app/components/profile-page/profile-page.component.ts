import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PersonalInfoComponent } from '../personal-info/personal-info.component';
import { RouterModule } from '@angular/router';
import { ContactInfoComponent } from '../contact-info/contact-info.component';
import { AddressInfoComponent } from '../address-info/address-info.component';
import { RegisterService } from 'src/app/services/register.service';
import { NgToastService } from 'ng-angular-popup';
import { CapitalizePipe } from 'src/app/core/pipes/capitalize.pipe';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [CommonModule, RouterModule, CapitalizePipe , PersonalInfoComponent, ContactInfoComponent, AddressInfoComponent],
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.scss']
})

export class ProfilePageComponent {
  customerData: any = {}; // Single variable to hold all customer data
  
  showPersonalModal = false;
  showContactModal = false;
  showAddressModal = false;
  showContactandAdressPopup = false;

  constructor(private user: RegisterService, private toast: CustomToastService) { }

  ngOnInit(): void {
    this.loadCustomerData(); // Load data when component initializes
  }

  loadCustomerData(): void {
    const customerId = this.getCustomerId(); // Get customer ID dynamically
    
    this.user.findCustomerById(customerId).subscribe({
      next: (response) => {
        this.customerData = response.data; // Assign the entire response data to the variable
        const { gender, fathersOrSpousesName, dob, highestQualification, adhaarNumber } = this.customerData;

        this.showContactandAdressPopup = [gender, fathersOrSpousesName, dob, highestQualification, adhaarNumber]
          .every(field => field !== null && field !== '' && field !== undefined);

      },
      error: (error) => {
        console.error('Error fetching customer data:', error);
      }
    });
  }

  getCustomerId() {
    return localStorage.getItem("customerId");
  }

  openPersonalModal(): void {
    this.showPersonalModal = true;
  }

  closePersonalModal(): void {
    this.showPersonalModal = false;
    this.loadCustomerData();
      // Inform BodyComponent (Navbar) to reload names
  window.dispatchEvent(new Event('storage')); // simple hack
  }

  openContactPopup(): void {
    if (this.showContactandAdressPopup) {
      this.showContactModal = true;
      // this.loadCustomerData();
    } else {
      this.toast.warning({ detail: "Error", summary: "Please update your personal details first.", duration: 5000 });
    }
  }

  closeContactPopup(): void {
    this.showContactModal = false;
    this.loadCustomerData();
  }

  openAddressPopup(): void {
    this.showAddressModal = true;
  }

  closeAddressPopup(): void {
    this.showAddressModal = false;
    this.loadCustomerData();
  }
}
