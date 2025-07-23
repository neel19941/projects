import { Component, EventEmitter, inject, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RegisterService } from 'src/app/services/register.service';
import { NgToastService } from 'ng-angular-popup';
import { LoanService } from 'src/app/services/loan.service';
import { StateModel } from './state-model';
import { TitleCaseDirective } from 'src/app/core/directives/title-case.directive';
import { CapitalizePipe } from 'src/app/core/pipes/capitalize.pipe';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';

@Component({
  selector: 'app-address-info',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule , CapitalizePipe ,TitleCaseDirective],
  templateUrl: './address-info.component.html',
  styleUrls: ['./address-info.component.scss']
})

export class AddressInfoComponent {
  @Output() closeModal: EventEmitter<void> = new EventEmitter();

  addressForm!: FormGroup;
  private data: any;
  private user = inject(RegisterService);
  private toast = inject(CustomToastService);
  private loanServ = inject(LoanService);

  stateObj: StateModel = new StateModel();
  states: any;
  currentStateId: any;
  permanentStateId: any;
  previousPermanentStateId : any;
  isPermanentAddressSame: boolean = false;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.initForm();
    this.loadStates();
    this.loadAddressData();
    this.UpdatedAddresses();
    this.stateID();
  }

  initForm() {
     this.addressForm = this.fb.group({

     // Temporary Address Fields
     // tempaddress: ['', Validators.required],
     // tempcity: ['', [Validators.required, Validators.pattern('[a-zA-Z ]*')]],
     // templocation: ['', [Validators.required, Validators.pattern('[a-zA-Z ]*')]],
     // templandmark: ['', [Validators.required, Validators.pattern('[a-zA-Z ]*')]],

      tempaddress: ['', [Validators.required, Validators.pattern(/^(?!\s*$).+/)]],
      tempcity: ['', [Validators.required, Validators.pattern(/^(?!\s*$)[a-zA-Z\s]{4,}$/)]],
      tempstate: ['', Validators.required],
      templocation: ['', [Validators.required, Validators.pattern(/^(?!\s*$)[a-zA-Z\s]{4,}$/)]],
      templandmark: ['', [Validators.required, Validators.pattern(/^(?!\s*$).+/)]],
      tempstayedOfYears: ['', [Validators.required, Validators.min(1)]],
      temppincode: ['', [Validators.required, Validators.pattern('^(?!0{6}$)[0-9]{6}$')]],

      // Checkbox for Same as Current Address
      sameAsCurrent: [false],

      // Permanent Address Fields
      // permanentAddress: ['', Validators.required],
      permanentAddress: ['', [Validators.required, Validators.pattern(/^(?!\s*$).+/)]],

      // permanentCity: ['', [Validators.required, Validators.pattern('[a-zA-Z ]*')]],
      permanentCity: ['', [Validators.required, Validators.pattern(/^(?!\s*$)[a-zA-Z\s]{4,}$/)]],

      permanentState: ['', Validators.required],
      // permanentLocation: ['', [Validators.required, Validators.pattern('[a-zA-Z ]*')]],
      permanentLocation: ['', [Validators.required, Validators.pattern(/^(?!\s*$)[a-zA-Z\s]{4,}$/)]],

      // permanentLandmark: ['', [Validators.required, Validators.pattern('[a-zA-Z ]*')]],

      permanentLandmark: ['', [Validators.required, Validators.pattern(/^(?!\s*$).+/)]],

      permanentStayedOfYears: ['', [Validators.required, Validators.min(1)]],
      permanentPincode: ['', [Validators.required, Validators.pattern('^(?!0{6}$)[0-9]{6}$')]],

    });
  }

  loadStates(): void {
    this.loanServ.getStateCode().subscribe({
      next: (response) => {
        console.log('State API Responses:', response.data); // Log the response for analysis
        this.states = response.data;
      },
      error: (error) => {
        console.error('Failed to load states:', error);
      },
    });
  }

  // Load the existing address data if needed (similar to how you fetched customer data)
  private loadAddressData(): void {
    const customerId = localStorage.getItem("customerId");
    if (customerId) {
      this.user.findCustomerById(customerId).subscribe({
        next: (data) => {
          this.data = data; // Store fetched data
          console.log('Fetched Data:', this.data);
          // Populate address form if data is found
          this.populateForm(this.data);  // Assume you have the appropriate data structure
        },
        error: (error) => {
          console.error('Error fetching address data:', error);
        }
      });
    } else {
      console.error('Customer ID not found.');
    }
  }

  // toTitleCase(value: string): string {
  //   if (!value) return '';
  //   return value
  //     .toLowerCase()
  //     .split(' ')
  //     .map(word => word.charAt(0).toUpperCase() + word.slice(1))
  //     .join(' ');
  // }
  
  // Populate the form with existing data
  private populateForm(data: any): void {
    console.log(data.data.permanentAddress.state.state);
    // Check if current and permanent addresses are the same
  const isSameAddress = this.isSameAddress(data.data.currentAddress, data.data.permanentAddress);
    this.addressForm.patchValue({

      tempaddress: data.data.currentAddress.address || '',
      tempcity: data.data.currentAddress.city || '',
      tempstate: data.data.currentAddress.state.state || '',
      templocation: data.data.currentAddress.location || '',
      templandmark: data.data.currentAddress.landmark || '',
      tempstayedOfYears: data.data.currentAddress.stayedOfYears || '',
      temppincode: data.data.currentAddress.pincode || '',

      permanentAddress: data.data.permanentAddress.address || '',
      permanentCity: data.data.permanentAddress.city || '',
      permanentState: data.data.permanentAddress.state.state || '',
      permanentLocation: data.data.permanentAddress.location || '',
      permanentLandmark: data.data.permanentAddress.landmark || '',
      permanentStayedOfYears: data.data.permanentAddress.stayedOfYears || '',
      permanentPincode: data.data.permanentAddress.pincode || ''
    });
      // Set the checkbox if the addresses are the same
  this.addressForm.get('sameAsCurrent')?.setValue(isSameAddress);
  if(isSameAddress){
    this.addressForm.get('permanentState')?.disable();
  }else{
    this.addressForm.get('permanentState')?.enable();
  }
  }

  private isSameAddress(currentAddress: any, permanentAddress: any): boolean {
    return (
      this.areFieldsEqual(currentAddress.address, permanentAddress.address) &&
      this.areFieldsEqual(currentAddress.city, permanentAddress.city) &&
      this.areFieldsEqual(currentAddress.state?.state, permanentAddress.state?.state) &&
      this.areFieldsEqual(currentAddress.location, permanentAddress.location) &&
      this.areFieldsEqual(currentAddress.landmark, permanentAddress.landmark) &&
      this.areFieldsEqual(currentAddress.pincode, permanentAddress.pincode)
    );
  }
  
  // Helper function to compare fields safely
  private areFieldsEqual(field1: any, field2: any): boolean {
    return field1 !== null && field2 !== null && field1 === field2;
  }


  currentOnStateChange(event: Event): void {
    const selectedStateName = (event.target as HTMLSelectElement).value;
    const selectedState = this.states.find((state: any) => state.state === selectedStateName);

    if (selectedState) {
      this.currentStateId = selectedState.stateId;
      console.log('Selected State ID:', this.currentStateId);
      if (this.addressForm.get('sameAsCurrent')?.value) {
        this.permanentStateId = this.currentStateId;
      }
    } else {
      console.log('No state selected or invalid state');
    }
  }

  permanentOnStateChange(event: Event): void {
    const selectedStateName = (event.target as HTMLSelectElement).value;
    const selectedState = this.states.find((state: any) => state.state === selectedStateName);

    if (selectedState) {
      this.permanentStateId = selectedState.stateId;
   
      console.log('Selected State ID from Permanent Address:', this.permanentStateId);
      
    } else {
      console.log('No state selected or invalid state');
    }
  }

  UpdatedAddresses() {
    this.addressForm.get('tempaddress')?.valueChanges.subscribe(() => this.updatePermanentAddress());
    this.addressForm.get('tempcity')?.valueChanges.subscribe(() => this.updatePermanentAddress());
    this.addressForm.get('tempstate')?.valueChanges.subscribe(() => this.updatePermanentAddress());
    this.addressForm.get('templocation')?.valueChanges.subscribe(() => this.updatePermanentAddress());
    this.addressForm.get('templandmark')?.valueChanges.subscribe(() => this.updatePermanentAddress());
    this.addressForm.get('tempstayedOfYears')?.valueChanges.subscribe(() => this.updatePermanentAddress());
    this.addressForm.get('temppincode')?.valueChanges.subscribe(() => this.updatePermanentAddress());
  }
  updatePermanentAddress() {
    if (this.addressForm.get('sameAsCurrent')?.value) {
      // alert(this.addressForm.get('tempstate')?.value);
      // alert("present curent Id " + this.currentStateId);
      // this.permanentStateId = this.currentStateId;
      // alert("update pstateId" + this.permanentStateId);
      this.addressForm.patchValue({
        permanentAddress: this.addressForm.get('tempaddress')?.value,
        permanentCity: this.addressForm.get('tempcity')?.value,
        permanentState: this.addressForm.get('tempstate')?.value,
        permanentLocation: this.addressForm.get('templocation')?.value,
        permanentLandmark: this.addressForm.get('templandmark')?.value,
        permanentStayedOfYears: this.addressForm.get('tempstayedOfYears')?.value,
        permanentPincode: this.addressForm.get('temppincode')?.value,
      });
    }
  }

  stateID(){
    const customerId = this.getId();
    if (customerId) {
      this.user.findCustomerById(customerId).subscribe({
        next: (existingData) => {
          this.permanentStateId = existingData.data.permanentAddress.state.stateId;
          this.previousPermanentStateId = existingData.data.permanentAddress.state.stateId;
          this.currentStateId = existingData.data.currentAddress.state.stateId;
           
          console.log("permanent ID" + this.permanentStateId + "current ID" + this.currentStateId);
          console.log("previous ID storage" + this.previousPermanentStateId);
        },
        error: (error) => {
          console.error('Error fetching existing data:', error);
        },
      });
    }
}

  sendData() {
    if (this.addressForm.valid) {
      const customerId = this.getId();
      if (customerId) {
        this.user.findCustomerById(customerId).subscribe({
          next: (existingData) => {
            let updatedData;
            if (existingData.data.permanentAddress !== null && existingData.data.currentAddress !== null) {
              updatedData = {
                permanentAddress: {
                  address: this.addressForm.value.permanentAddress,
                  city: this.addressForm.value.permanentCity,
                  // state: this.addressForm.value.permanentState,
                  country: "india",
                  location: this.addressForm.value.permanentLocation,
                  landmark: this.addressForm.value.permanentLandmark,
                  stayedOfYears: this.addressForm.value.permanentStayedOfYears,
                  pincode: this.addressForm.value.permanentPincode,
                  stateId: this.permanentStateId,
                  paddressId: existingData.data.permanentAddress.paddressId
                  
                },
                currentAddress: {
                  address: this.addressForm.value.tempaddress,
                  city: this.addressForm.value.tempcity,
                  // state: this.addressForm.value.tempstate,
                  country: "india",
                  location: this.addressForm.value.templocation,
                  landmark: this.addressForm.value.templandmark,
                  stayedOfYears: this.addressForm.value.tempstayedOfYears,
                  pincode: this.addressForm.value.temppincode,
                  stateId: this.currentStateId,
                  caddressId: existingData.data.currentAddress.caddressId
                  
                }
              };
          
            } else {
              updatedData = {
                permanentAddress: {
                  address: this.addressForm.value.permanentAddress,
                  city: this.addressForm.value.permanentCity,
                  // state: this.addressForm.value.permanentState,
                  country: "india",
                  location: this.addressForm.value.permanentLocation,
                  landmark: this.addressForm.value.permanentLandmark,
                  stayedOfYears: this.addressForm.value.permanentStayedOfYears,
                  pincode: this.addressForm.value.permanentPincode,
                  stateId: this.permanentStateId
                },
                currentAddress: {
                  address: this.addressForm.value.tempaddress,
                  city: this.addressForm.value.tempcity,
                  // state: this.addressForm.value.tempstate,
                  country: "india",
                  location: this.addressForm.value.templocation,
                  landmark: this.addressForm.value.templandmark,
                  stayedOfYears: this.addressForm.value.tempstayedOfYears,
                  pincode: this.addressForm.value.temppincode,
                  stateId: this.currentStateId
                }
              };
            }
          
            // Send merged data to the server
            this.user.updateAddressData(customerId, updatedData).subscribe({
              next: (response) => {
                console.log('Data updated successfully:', response);
                this.toast.success({
                  detail: 'Success',
                  summary: 'Address info updated successfully',
                  duration: 3000,
                });
                this.close();
              },

              error: (error) => {
                console.error('Error updating data:', error);
                this.toast.error({
                  detail: 'Error',
                  summary: 'Failed to update contact info. Please try again.',
                  duration: 3000,
                });
              },
            });
          },
          error: (error) => {
            console.error('Error fetching existing data:', error);
          },
        });
      }
    } else {
      console.log('Form is not valid. Please correct the errors.');
      this.toast.error({
        detail: 'Error',
        summary: 'Form is not valid. Please correct the errors.',
        duration: 3000,
      });
      this.markAllFieldsTouched();
    }
  }

  markAllFieldsTouched(): void {
    Object.keys(this.addressForm.controls).forEach((key) => {
      const control = this.addressForm.get(key);
      control?.markAsTouched();
      control?.updateValueAndValidity();
    });
  }

  getId() {
    return localStorage.getItem("customerId");
  }

  copyCurrentAddress(): void {
    if (this.addressForm.get('sameAsCurrent')?.value) {
      this.addressForm.patchValue({
        permanentAddress: this.addressForm.get('tempaddress')?.value,
        permanentCity: this.addressForm.get('tempcity')?.value,
        permanentState: this.addressForm.get('tempstate')?.value,
        permanentLocation: this.addressForm.get('templocation')?.value,
        permanentLandmark: this.addressForm.get('templandmark')?.value,
        permanentPincode: this.addressForm.get('temppincode')?.value,
        permanentStayedOfYears: this.addressForm.get('tempstayedOfYears')?.value,
      });
      this.permanentStateId = this.currentStateId;
      console.log("check premanent ID"+this.permanentStateId);
      // Disable only the state field
      this.addressForm.get('permanentState')?.disable();
      // Make permanent address fields readonly
      this.isPermanentAddressSame = true;
    } else if(!(this.addressForm.get('sameAsCurrent')?.value)){
      this.permanentStateId = "";
      console.log("uncheck  permanent ID"+this.permanentStateId);
      this.resetPermanentAddressFields();
      this.addressForm.get('permanentState')?.enable();
      this.isPermanentAddressSame = false;
    }else{
      this.resetPermanentAddressFields();
    
      // Enable the state field explicitly
      this.addressForm.get('permanentState')?.enable();
      // Make permanent address fields editable
      this.isPermanentAddressSame = false;
    }
  }

  resetPermanentAddressFields(): void {
    this.addressForm.patchValue({
      permanentAddress: '',
      permanentCity: '',
      permanentState: '',
      permanentLocation: '',
      permanentLandmark: '',
      permanentPincode: '',
      permanentStayedOfYears: '',
    });
 
  }

  close(): void {
    this.closeModal.emit(); // Emit the close event
  }
}

