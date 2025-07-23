import { Component, EventEmitter, inject, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RegisterModel } from '../register/register-model';
import { RegisterService } from 'src/app/services/register.service';
import { IdSaveService } from 'src/app/core/services/id-save.service';
import { NgToastService } from 'ng-angular-popup';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';

@Component({
  selector: 'app-contact-info',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './contact-info.component.html',
  styleUrls: ['./contact-info.component.scss']
})

export class ContactInfoComponent {

  @Output() closeModal: EventEmitter<void> = new EventEmitter();

  contactForm!: FormGroup;
  private data: any;
  private customerId: any;
  registerModelObj: RegisterModel = new RegisterModel();
  private user = inject(RegisterService);
  private idServ = inject(IdSaveService);
  private toast = inject(CustomToastService);
  private auth = inject(AuthService); 
  constructor(private fb: FormBuilder , private rtr : Router) { }

  ngOnInit(): void {
    this.initializeForm(); // Initialize the form
    this.loadCustomerData(); // Fetch and populate data
    this.customerId = this.getId();
    console.log("Customer ID:", this.customerId);
  }

  // Initialize the form
  private initializeForm(): void {
    this.contactForm = this.fb.group({
      // mobileNumber: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
      mobileNumber: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
      // email: ['', [Validators.required, Validators.email]],
      email: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]],
    });
  }

  // Fetch customer data by ID
  private loadCustomerData(): void {
    const customerId = localStorage.getItem("customerId");
    if (customerId) {
      this.user.findCustomerById(customerId).subscribe({
        next: (data) => {
          this.data = data; // Store fetched data+
          console.log('Fetched Data:', this.data);
          this.populateForm(this.data); // Populate form with data
        },
        error: (error) => {
          console.error('Error fetching customer data:', error);
        }
      });
    } else {
      console.error('Customer ID not found.');
    }
  }

  // Populate the form with fetched data
  private populateForm(data: any): void {
    this.contactForm.patchValue({
      mobileNumber: data.data.mobileNumber || '',
      email: data.data.email || ''
    });
  }

  // Retrieve customer ID
  private getId(): any {
    return localStorage.getItem("customerId");
  }

  sendData(): void {
    
    if (this.contactForm.valid) {
      const customerId = this.getId();
      if (customerId) {
        // Fetch existing data
        this.user.findCustomerById(customerId).subscribe({
          next: (existingData) => {
            // Merge existing data with form data
            const updatedData = {
              ...existingData.data,
              mobileNumber: this.contactForm.value.mobileNumber,
              email: this.contactForm.value.email,
            };

            if (existingData.data.email !== this.contactForm.value.email) {
              // Send merged data to the server
              this.user.checkDuplicateEmail(updatedData.email).subscribe({
                next: (response: any) => {
                  if (response.data === false) {
                    this.user.updateCustomer(updatedData).subscribe({
                      next: (response) => {
                        console.log('Data updated successfully:', response);
                        this.toast.success({
                          detail: 'Success',
                          summary: 'Update successful. Please sign in again.',
                          duration: 3000,
                        });
                        this.close();
                        this.auth.isLogOut();
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
                  } else {
                    // Email already exists, show a message
                    this.toast.warning({ detail: "Warning", summary: 'Email already exists.', duration: 5000 });
                  }
                },
                error: (err) => {
                  console.error('Error checking email:', err);
                  this.toast.error({ detail: "Error", summary: 'Error checking email. Please try again.', duration: 5000 });
                }
              });
            }
            else{
            this.user.updateCustomer(updatedData).subscribe({
              next: (response) => {
                console.log('Data updated successfully:', response);
                this.toast.success({
                  detail: 'Success',
                  summary: 'Contact info updated successfully',
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
          }
          },
          error: (error) => {
            console.error('Error fetching existing data:', error);
          },
        });
      }
    } 
    else {
      console.log('Form is not valid. Please correct the errors.');
      this.toast.error({ detail: 'Error', summary: 'Form is not valid. Please correct the errors.', duration: 3000, });
    }
  }

  // Close modal function
  close(): void {
    this.closeModal.emit();
  }
}

