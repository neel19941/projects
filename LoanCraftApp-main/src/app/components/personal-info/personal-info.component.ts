import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { RegisterService } from 'src/app/services/register.service';
import { IdSaveService } from 'src/app/core/services/id-save.service';
import { RegisterModel } from '../register/register-model';
import { NgToastService } from 'ng-angular-popup';
import { TitleCaseDirective } from 'src/app/core/directives/title-case.directive';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';

@Component({
  selector: 'app-personal-info',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, TitleCaseDirective],
  templateUrl: './personal-info.component.html',
  styleUrls: ['./personal-info.component.scss']
})

export class PersonalInfoComponent {
  @Input() Restricted: string = '';
  @Output() closeModal: EventEmitter<void> = new EventEmitter();
  personalForm!: FormGroup;
  private data: any;
  private customerId: any;
  registerModelObj: RegisterModel = new RegisterModel();
  private user = inject(RegisterService);
  private idServ = inject(IdSaveService);
  private toast = inject(CustomToastService); // Inject NgToastService

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.initializeForm(); // Initialize the form
    this.loadCustomerData(); // Call the method to fetch customer data
    this.customerId = this.getId();
  }

  // Initialize the form
  private initializeForm(): void {
    this.personalForm = this.fb.group({
      // title: ['', Validators.required],
      firstname: ['', [Validators.required, Validators.pattern(/^(?!\s*$)[a-zA-Z\s]{4,}$/)]],
      // middlename: ['', [Validators.pattern(/^[a-zA-Z\s]+$/), Validators.minLength(3)]],
      middlename: ['', [Validators.pattern(/^(?!\s*$)[a-zA-Z\s]{3,}$/)]],
      // lastname: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\s]+$/), Validators.minLength(3)]],
      lastname: ['', [Validators.required, Validators.pattern(/^(?!\s*$)[a-zA-Z\s]{4,}$/)]],
      gender: ['', Validators.required],
      // fathersOrSpousesName: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\s]+$/), Validators.minLength(5)]],
      fathersOrSpousesName: ['', [ Validators.required, Validators.pattern(/^(?!\s*$)[a-zA-Z\s]{5,}$/)]],
      // dob: ['', Validators.required],
      dob: ['', [Validators.required, this.validateAge]],
      
      // email: ['', [Validators.required, Validators.email]],
      highestQualification: ['', [Validators.required]],
      // mobileNumber: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
      adhaarNumber: ['', [Validators.required, Validators.pattern('^(?!0{12})[0-9]{12}$')]]
    });
  }
  // Fetch customer data by ID
  private loadCustomerData(): void {
    // const customerId = this.idServ.getCustomerId(); // Get the customer ID from IdSaveService
    const customerId = localStorage.getItem("customerId");
    if (customerId) {
      this.user.findCustomerById(customerId).subscribe({
        next: (data) => {
          this.data = data; // Store the fetched data
          console.log('Fetched Data:', this.data); // Log the data to the console
          this.populateForm(this.data); // Populate the form with fetched data
        },
        error: (error) => {
          console.error('Error fetching customer data:', error); // Handle any errors
        }
      });
    } else {
      console.error('Customer ID not found.');
    }
  }
  // Populate the form with fetched data
  private populateForm(data: any): void {
    console.log(data.data);
    this.personalForm.patchValue({
      // title: data.title || '', // Default to an empty string if the value is null
      firstname: data.data.firstName || '',
      // middlename: data.middleName || '',
      middlename: data.data.middleName || '',
      lastname: data.data.lastName || '',
      gender: data.data.gender || '',
      fathersOrSpousesName: data.data.fathersOrSpousesName || '',
      dob: data.data.dob || '',
      // email: data.data.email || '',
      highestQualification: this.toTitleCase(data.data.highestQualification || ''),
      // mobileNumber: data.data.mobileNo || '', // Adjusted to match `mobileNo` in the response
      adhaarNumber: data.data.adhaarNumber || ''
    });
  }

  getId() {
    return localStorage.getItem("customerId");
  }
  toTitleCase(value: string): string {
    if (!value) return '';
    return value
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  validateAge(control: AbstractControl): ValidationErrors | null {
    const dobValue = control.value;
    if (!dobValue) return null;

    const dob = new Date(dobValue);
    const today = new Date();

    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--;
    }

    if (age < 18) {
      return { underage: true };
    }

    return null;
  }
  // onDobChange(event: Event) {
  //   const inputElement = event.target as HTMLInputElement;
  //   const dob = new Date(inputElement.value);
  //   const today = new Date();

  //   // Calculate age
  //   let age = today.getFullYear() - dob.getFullYear();  // Change 'const' to 'let'
  //   const monthDiff = today.getMonth() - dob.getMonth();

  //   if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
  //     // Adjust age if birthday hasn't occurred yet this year
  //     age--;
  //   }

  //   // Check if the user is under 18
  //   if (age < 18) {
  //     this.personalForm.get('dob')?.setErrors({ underage: true });
  //   } else {
  //     this.personalForm.get('dob')?.setErrors(null);  // Clear any errors if valid
  //   }
  // }

  sendData() {
    if (this.personalForm.valid) {
      const customerId = this.getId();
      if (customerId) {
        // Fetch existing data
        this.user.findCustomerById(customerId).subscribe({
          next: (existingData) => {
            // Merge existing data with form data
            const updatedData = {
              ...existingData.data,
              // updatedBy : customerId,
              firstName: this.personalForm.value.firstname,
              middleName: this.personalForm.value.middlename,
              lastName: this.personalForm.value.lastname,
              gender: this.personalForm.value.gender,
              fathersOrSpousesName: this.personalForm.value.fathersOrSpousesName,
              dob: this.personalForm.value.dob,
              highestQualification: this.personalForm.value.highestQualification,
              adhaarNumber: this.personalForm.value.adhaarNumber,
            };
            if (this.Restricted === null || this.Restricted === '') {
              localStorage.setItem("firstname", this.personalForm.value.firstname);
              localStorage.setItem("lastname", this.personalForm.value.middlename + this.personalForm.value.lastname);
            }

            // Send merged data to the server
            this.user.updateCustomer(updatedData).subscribe({
              next: (response) => {
                console.log('Data updated successfully:', response);
                this.toast.success({
                  detail: 'Success',
                  summary: 'Personal info updated successfully',
                  duration: 3000,
                });
                this.close();
              },
              error: (error) => {
                console.error('Error updating data:', error);
                this.toast.error({
                  detail: 'Error',
                  summary: 'Failed to update personal info. Please try again.',
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
    Object.keys(this.personalForm.controls).forEach((key) => {
      const control = this.personalForm.get(key);
      control?.markAsTouched();
      control?.updateValueAndValidity();
    });
  }
  close(): void {
    this.closeModal.emit(); // Emit the close event
  }
}
