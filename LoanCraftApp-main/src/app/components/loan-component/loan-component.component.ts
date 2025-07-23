import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { BankingDetails, CurrentAddress, EmploymentDetails, ExistingLoanDetails, IncomeDetails, LoanDetails, LoanModel, PermanentAddress, PropertyDetails, Reference } from './loan-model';
import { Router } from '@angular/router';
import { SuccessDataService } from 'src/app/core/services/success-data.service';
import { LoanService } from 'src/app/services/loan.service';

@Component({
  selector: 'app-loan-component',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './loan-component.component.html',
  styleUrls: ['./loan-component.component.scss']
})
export class LoanComponentComponent {
  loanForm!: FormGroup;
  LoanModelObj: LoanModel = new LoanModel();
  
  currentPage = 1;
  totalPages = 2;

  // Reference to the sections
  isSubmitting = false;
  isPermanentAddressSame: boolean = false;
  showCustomerIdField = false;
  incomeTotal: number = 0;
  expenditureTotal: number = 0;
  netIncome: number = 0;

  constructor(private fb: FormBuilder, private api: LoanService, private rtr: Router, private successData: SuccessDataService) { }

  ngOnInit(): void {
    this.LoanForm();
    this.addLoan();
    this.addProperty();
    this.addReference();
    this.DynamicProofvalidation();
    this.UpdatedAddresses();
  }

  LoanForm() {
    this.loanForm = this.fb.group({
      title: ['', Validators.required],  // Title validation: Required
      fullname: ['', [Validators.required, Validators.minLength(3), Validators.pattern('^[a-zA-Z ]*$')],], // Full Name validation: Required, minimum 3 characters, letters and spaces only
      fathersOrSpousesName: ['', [Validators.required, Validators.minLength(3), Validators.pattern(/^[a-zA-Z ]+$/)]], // Only letters and spaces,
      dob: ['', Validators.required], // Required only
      gender: ['', Validators.required],  // Gender is required
      maritalStatus: ['', Validators.required], // Marital Status is required
      email: ['', [Validators.required, this.strictEmailValidator()]],  // Email ID: required and must be a valid email
      highestQualification: ['', [Validators.required, Validators.pattern('^[a-zA-Z. ]*$')]],  // Highest Qualification: required
      category: ['', Validators.required],  // Category is required
      religion: ['', Validators.required],  // Religion is required

      // dependents: ['', Validators.required],  // Require dependents
      mobileNumber: ['', [Validators.required, Validators.pattern(/^(\+\d{1,3}[- ]?)?\d{10}$/)]], // Validate 10-digit mobile number
      adhaarNumber: ['', [Validators.required, Validators.pattern(/^\d{12}$/)]], // Validate 12-digit Aadhaar number
      panCard: ['', [Validators.required, Validators.pattern(/[A-Z]{5}[0-9]{4}[A-Z]{1}/)]],// Validate PAN number (e.g., AAAAA1234A

      passportNumber: ['', [Validators.required, Validators.pattern(/^[A-Z]{1}[A-Z0-9]{7}$/)]],  // Passport number: e.g., A1234567
      voterId: ['', [Validators.required, Validators.pattern(/^[A-Z0-9]{10,12}$/)]],  // Voter ID: e.g., ABCD123456
      drivingLicense: ['', [Validators.required, Validators.pattern('^[A-Z]{2}[0-9]{2}[A-Z0-9]{7}$')]],  // Driving License: e.g., DL02ABC1234
      gstNumber: ['', [Validators.pattern(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[0-9]{1}[A-Z]{1}[0-9]{1}$/)]], // GST Number: e.g., 27ABCDE1234F1Z5

      //  current address
      tempaddress: ['', Validators.required],
      tempcity: ['', [Validators.required, Validators.pattern('^[A-Za-z\\s]+$')]],
      tempstate: ['', [Validators.required, Validators.pattern('^[A-Za-z\\s]+$')]],
      templocation: ['', [Validators.required, Validators.pattern('^[A-Za-z\\s]+$')]],
      templandmark: ['', [Validators.required, Validators.pattern('^[A-Za-z0-9\\s]+$')]],  // Letters, numbers, spaces
      tempstayedOfYears: ['', [Validators.required, Validators.min(1), Validators.pattern('^[0-9]+$')]],  // Positive integer (min value is 1)
      temppincode: ['', [Validators.required, Validators.pattern('^[0-9]{6}$')]],  // 6-digit pincode

      sameAsCurrent: [false],

      // permanent Address
      permanentAddress: ['', Validators.required],
      permanentCity: ['', [Validators.required, Validators.pattern('^[A-Za-z\\s]+$')]],
      permanentState: ['', [Validators.required, Validators.pattern('^[A-Za-z\\s]+$')]],
      permanentLocation: ['', [Validators.required, Validators.pattern('^[A-Za-z\\s]+$')]],
      permanentLandmark: ['', [Validators.required, Validators.pattern('^[A-Za-z0-9\\s]+$')]],
      permanentStayedOfYears: ['', [Validators.required, Validators.min(1), Validators.pattern('^[0-9]+$')]],
      permanentPincode: ['', [Validators.required, Validators.pattern('^[0-9]{6}$')]],

      // Employment Details
      empemploymentType: ['', [Validators.required, Validators.minLength(3), Validators.pattern('^[a-zA-Z]*$')]],
      empsalary: ['', [Validators.required, Validators.min(0)]],
      empyearsinEmployment: ['', [Validators.required, Validators.min(1)]],
      empcompanyName: ['', [Validators.required, Validators.minLength(3), Validators.pattern('^[a-zA-Z]*$')]],
      empcompanyAdrees: ['', [Validators.required, Validators.maxLength(10)]],
      emppincode: ['', [Validators.required, Validators.pattern('^[0-9]{6}$')]],
      empgstDetails: ['', [Validators.required, Validators.pattern(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[0-9]{1}[A-Z]{1}[0-9]{1}$/)]],

      // Banking & KYC Details
      baccountHolder: ['', [Validators.required, Validators.minLength(3), Validators.pattern(/^[a-zA-Z\s]+$/)]],
      bbranchName: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\s]+$/)]],
      baccountNo: ['', [Validators.required, Validators.pattern(/^[0-9]+$/), Validators.minLength(10), Validators.maxLength(16)]],
      BAcctype: ['', Validators.required],
      bdateOfOpening: ['', Validators.required],
      ifsccode: ['', [Validators.required, Validators.pattern(/^[A-Z]{4}0[A-Z0-9]{6}$/)]],

      // Address Proof
      applicantAddressDocumentProof: ['', Validators.required], // Dropdown selection
      applicantAddressNumberProof: ['', Validators.required],   // Validation dynamically updated
      applicantAddressIssueDateProof: [''],                     // Issue date
      applicantAddressExpDateProof: [''],                       // Expiry date

      // Age Proof
      applicantAgeDocumentProof: ['', Validators.required], // Dropdown selection
      applicantAgeNumberProof: ['', Validators.required],   // Dynamic validation applied
      applicantAgeIssueDateProof: [''],
      applicantAgeExpDateProof: [''],

      // ID Proof
      applicantIdDocumentProof: ['', Validators.required], // Dropdown selection
      applicantIdNumberProof: ['', Validators.required],   // Dynamic validation applied
      applicantIdIssueDateProof: [''],
      applicantIdExpDateProof: [''],

      // Signature Proof
      applicantSignatureDocumentProof: ['', Validators.required], // Dropdown selection
      applicantSignatureNumberProof: ['', Validators.required],   // Dynamic validation applied
      applicantSignatureIssueDateProof: [''],
      applicantSignatureExpDateProof: [''],

      // Others
      // applicantOthersDocumentProof: ['',Validators.required],
      // applicantOthersNumberProof: ['',Validators.required],  
      // applicantOthersIssueDateProof: [''],
      // applicantOthersExpDateProof: [''],

      // Property Details
      properties: this.fb.array([]), // FormArray for multiple properties
      //Existing loan deatils
      loans: this.fb.array([]), // FormArray for multiple loans

      // Details of Loan Applied For
      purposeOfLoan: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\s]+$/)]], // Accepts letters and spaces
      DloanAmount: ['', [Validators.required, Validators.min(1)]], // Minimum value of 1
      loanTenure: ['', [Validators.required, Validators.min(1)]], // Minimum value of 1 month
      repaymentMode: ['', Validators.required], // Required field
      loanTaken: ['', Validators.required], // Required field
      customerId: ['', [Validators.pattern(/^\d+$/)]], // Only numbers


      // Income details
      incomeApplicant: ['', [Validators.required, Validators.min(0)]],
      incomeOthers1: ['', [Validators.required, Validators.min(0)]],
      incomeOthers2: ['', [Validators.required, Validators.min(0)]],
      incomeOthers3: ['', [Validators.required, Validators.min(0)]],
      incomeTotal: [''],

      // Expenditure details
      rent: ['', [Validators.required, Validators.min(0)]],
      loan: ['', [Validators.required, Validators.min(0)]],
      education: ['', [Validators.required, Validators.min(0)]],
      others: ['', [Validators.required, Validators.min(0)]],
      expenditureTotal: [''],

      // Net income
      netIncome: [''],

      // Reference details
      references: this.fb.array([]), // Initialize the FormArray
    });
  }
  
  DynamicProofvalidation() {
    // Set up dynamic validation based on selected document type
    this.loanForm.get('applicantAddressDocumentProof')?.valueChanges.subscribe((documentType) => {
      const numberControl = this.loanForm.get('applicantAddressNumberProof');

      if (documentType === 'Aadhar') {
        numberControl?.setValidators([
          Validators.required,
          Validators.pattern('^[0-9]{12}$'), // 12-digit Aadhaar
        ]);
      } else if (documentType === 'PAN') {
        numberControl?.setValidators([
          Validators.required,
          Validators.pattern('^[A-Z]{5}[0-9]{4}[A-Z]{1}$'), // PAN format
        ]);
      } else if (documentType === 'Voter ID') {
        numberControl?.setValidators([
          Validators.required,
          Validators.pattern('^[A-Z]{3}[0-9]{7}$'), // Voter ID format
        ]);
      } else if (documentType === 'Driving License') {
        numberControl?.setValidators([
          Validators.required,
          Validators.pattern('^[A-Z]{2}[0-9]{2}[A-Z0-9]{4}[0-9]{1,7}$'), // Driving License format
        ]);
      } else if (documentType === 'Passport') {
        numberControl?.setValidators([
          Validators.required,
          Validators.pattern('^[A-Z]{1}[0-9]{7}$'), // Passport format
        ]);
      } else {
        numberControl?.clearValidators(); // Clear validators if no valid document type is selected
      }

      // Update validation status
      numberControl?.updateValueAndValidity();
    });
    this.loanForm.get('applicantAgeDocumentProof')?.valueChanges.subscribe((documentType) => {
      const numberControl = this.loanForm.get('applicantAgeNumberProof');

      if (documentType === 'Aadhar') {
        numberControl?.setValidators([
          Validators.required,
          Validators.pattern('^[0-9]{12}$'), // 12-digit Aadhaar
        ]);
      } else if (documentType === 'PAN') {
        numberControl?.setValidators([
          Validators.required,
          Validators.pattern('^[A-Z]{5}[0-9]{4}[A-Z]{1}$'), // PAN format
        ]);
      } else if (documentType === 'Voter ID') {
        numberControl?.setValidators([
          Validators.required,
          Validators.pattern('^[A-Z]{3}[0-9]{7}$'), // Voter ID format
        ]);
      } else if (documentType === 'Driving License') {
        numberControl?.setValidators([
          Validators.required,
          Validators.pattern('^[A-Z]{2}[0-9]{2}[A-Z0-9]{4}[0-9]{1,7}$'), // Driving License format
        ]);
      } else if (documentType === 'Passport') {
        numberControl?.setValidators([
          Validators.required,
          Validators.pattern('^[A-Z]{1}[0-9]{7}$'), // Passport format
        ]);
      } else {
        numberControl?.clearValidators(); // Clear validators if no valid document type is selected
      }

      // Update validation status
      numberControl?.updateValueAndValidity();
    });
    this.loanForm.get('applicantIdDocumentProof')?.valueChanges.subscribe((documentType) => {
      const numberControl = this.loanForm.get('applicantIdNumberProof');

      if (documentType === 'Aadhar') {
        numberControl?.setValidators([
          Validators.required,
          Validators.pattern('^[0-9]{12}$'), // 12-digit Aadhaar
        ]);
      } else if (documentType === 'PAN') {
        numberControl?.setValidators([
          Validators.required,
          Validators.pattern('^[A-Z]{5}[0-9]{4}[A-Z]{1}$'), // PAN format
        ]);
      } else if (documentType === 'Voter ID') {
        numberControl?.setValidators([
          Validators.required,
          Validators.pattern('^[A-Z]{3}[0-9]{7}$'), // Voter ID format
        ]);
      } else if (documentType === 'Driving License') {
        numberControl?.setValidators([
          Validators.required,
          Validators.pattern('^[A-Z]{2}[0-9]{2}[A-Z0-9]{4}[0-9]{1,7}$'), // Driving License format
        ]);
      } else if (documentType === 'Passport') {
        numberControl?.setValidators([
          Validators.required,
          Validators.pattern('^[A-Z]{1}[0-9]{7}$'), // Passport format
        ]);
      } else {
        numberControl?.clearValidators(); // Clear validators if no valid document type is selected
      }

      // Update validation status
      numberControl?.updateValueAndValidity();
    });
    this.loanForm.get('applicantSignatureDocumentProof')?.valueChanges.subscribe((documentType) => {
      const numberControl = this.loanForm.get('applicantSignatureNumberProof');

      if (documentType === 'Aadhar') {
        numberControl?.setValidators([
          Validators.required,
          Validators.pattern('^[0-9]{12}$'), // 12-digit Aadhaar
        ]);
      } else if (documentType === 'PAN') {
        numberControl?.setValidators([
          Validators.required,
          Validators.pattern('^[A-Z]{5}[0-9]{4}[A-Z]{1}$'), // PAN format
        ]);
      } else if (documentType === 'Voter ID') {
        numberControl?.setValidators([
          Validators.required,
          Validators.pattern('^[A-Z]{3}[0-9]{7}$'), // Voter ID format
        ]);
      } else if (documentType === 'Driving License') {
        numberControl?.setValidators([
          Validators.required,
          Validators.pattern('^[A-Z]{2}[0-9]{2}[A-Z0-9]{4}[0-9]{1,7}$'), // Driving License format
        ]);
      } else if (documentType === 'Passport') {
        numberControl?.setValidators([
          Validators.required,
          Validators.pattern('^[A-Z]{1}[0-9]{7}$'), // Passport format
        ]);
      } else {
        numberControl?.clearValidators(); // Clear validators if no valid document type is selected
      }

      // Update validation status
      numberControl?.updateValueAndValidity();
    });
    // this.loanForm.get('applicantOthersDocumentProof')?.valueChanges.subscribe((documentType) => {
    //   const numberControl = this.loanForm.get('applicantOthersNumberProof');

    //   if (documentType === 'Aadhar') {
    //     numberControl?.setValidators([
    //       Validators.required,
    //       Validators.pattern('^[0-9]{12}$'), // 12-digit Aadhaar
    //     ]);
    //   } else if (documentType === 'PAN') {
    //     numberControl?.setValidators([
    //       Validators.required,
    //       Validators.pattern('^[A-Z]{5}[0-9]{4}[A-Z]{1}$'), // PAN format
    //     ]);
    //   } else if (documentType === 'Voter ID') {
    //     numberControl?.setValidators([
    //       Validators.required,
    //       Validators.pattern('^[A-Z]{3}[0-9]{7}$'), // Voter ID format
    //     ]);
    //   } else if (documentType === 'Driving License') {
    //     numberControl?.setValidators([
    //       Validators.required,
    //       Validators.pattern('^[A-Z]{2}[0-9]{2}[A-Z0-9]{4}[0-9]{1,7}$'), // Driving License format
    //     ]);
    //   } else if (documentType === 'Passport') {
    //     numberControl?.setValidators([
    //       Validators.required,
    //       Validators.pattern('^[A-Z]{1}[0-9]{7}$'), // Passport format
    //     ]);
    //   } else {
    //     numberControl?.clearValidators(); // Clear validators if no valid document type is selected
    //   }

    //   // Update validation status
    //   numberControl?.updateValueAndValidity();
    // });
  }

  // checkDuplicateAadhaar() {
  //   const aadhaarNumber = this.loanForm.get('adhaarNumber')?.value;
  //   if (aadhaarNumber.toString().length === 12) {
  //     this.api.checkDuplicateAadhaar(aadhaarNumber).subscribe(
  //       (response) => {
  //         if (response.status.trim() === 'failed') {
  //           alert('This Aadhaar number already exists.');
  //           this.loanForm.reset();
  //         }
  //       },
  //       (error) => {
  //         console.error('Error checking Aadhaar:', error);
  //         alert('Failed to verify Aadhaar. Please try again later.');
  //       }
  //     );
  //   }
  // }

  showSnackbar(message: string, type: 'success' | 'error') {
    const snackbar = document.getElementById('customSnackbar');
    const messageContainer = document.getElementById('notificationMessage');
    const iconContainer = document.getElementById('notificationIcon');
  
    if (snackbar && messageContainer && iconContainer) {
      messageContainer.textContent = message;
  
      // Update classes and icon
      snackbar.className = `custom-snackbar show ${type}`;
      if (type === 'success') {
        iconContainer.className = 'bi bi-check-circle'; // Bootstrap success icon
      } else if (type === 'error') {
        iconContainer.className = 'bi bi-exclamation-circle'; // Bootstrap error icon
      }
  
      // Show the snackbar for 3 seconds
      setTimeout(() => {
        snackbar.className = snackbar.className.replace('show', '').trim();
      }, 3000);
    }
  }
  
  checkDuplicateAadhaar() {
    const aadhaarNumber = this.loanForm.get('adhaarNumber')?.value;
    if (aadhaarNumber.toString().length === 12) {
      this.api.checkDuplicateAadhaar(aadhaarNumber).subscribe(
        (response) => {
          if (response.status.trim() === 'failed') {
            this.showSnackbar('This Aadhaar number is already registered. Try another one.', 'error');
            this.loanForm.reset();
          }
        },
        (error) => {
          console.error('Error checking Aadhaar:', error);
          this.showSnackbar('Failed to verify Aadhaar. Please try again later.', 'error');
        }
      );
    }
  }

  addLoan() {
    const loanGroup = this.fb.group({
      nameOfInstitution: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\s]+$/)]], // Required
      purposeOfLoan: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\s]+$/)]], // Required
      loanAmount: ['', [Validators.required, Validators.min(1)]], // Positive number
      tenureOfLoan: ['', [Validators.required, Validators.min(1)]], // Minimum 1 month
      monthlyInstallment: ['', [Validators.required, Validators.min(1)]], // Positive number
      currentOutstanding: ['', [Validators.required, Validators.min(0)]], // Cannot be negative
      balanceTenure: ['', [Validators.required, Validators.min(0)]], // Minimum 0 months
    });

    this.loans.push(loanGroup);
  }

  // Remove a loan section
  removeLoan(index: number) {
    this.loans.removeAt(index);
  }
  // Getter for loans FormArray
  get loans() {
    return this.loanForm.get('loans') as FormArray;
  }

  // Method to add a new property to the FormArray
  addProperty() {
    const propertyGroup = this.fb.group({
      propertyOwnerName: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\s]+$/)]], // Only letters and spaces
      propertyLandAddress: ['', Validators.required],
      plotArea: ['', [Validators.required, Validators.pattern(/^\d+(\.\d+)?$/)]], // Numeric or decimal
      builtUpArea: ['', [Validators.required, Validators.pattern(/^\d+(\.\d+)?$/)]], // Numeric or decimal
      buildingAge: ['', [Validators.required, Validators.min(0)]], // Minimum value is 0
    });
    this.properties.push(propertyGroup);
  }

  // Method to remove a property from the FormArray
  removeProperty(index: number) {
    this.properties.removeAt(index);
  }
  // Getter for properties FormArray
  get properties() {
    return this.loanForm.get('properties') as FormArray;
  }

  // Method to add a new reference to the FormArray
  addReference() {
    const referenceGroup = this.fb.group({
      fullName: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\s]+$/)]],
      knownForYears: ['', [Validators.required, Validators.min(1)]],
      relation: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\s]+$/)]],
      pincode: ['', [Validators.required, Validators.pattern(/^[1-9][0-9]{5}$/)]],
      mobile: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
    });

    this.references.push(referenceGroup);
  }

  // Method to remove a reference by index
  removeReference(index: number) {
    this.references.removeAt(index);
  }
  // Getter for references FormArray
  get references() {
    return this.loanForm.get('references') as FormArray;
  }

  // Method to show the Customer ID field when "Yes" is selected
  showCustomerIdForYes() {
    this.showCustomerIdField = true; // Show Customer ID field when Yes is clicked
    // Make customerId field required if loanTaken is 'yes'
    this.loanForm.get('customerId')?.setValidators([Validators.required, Validators.pattern(/^\d+$/)]);
    this.loanForm.get('customerId')?.updateValueAndValidity();
  }

  // Method to hide the Customer ID field when "No" is selected
  showCustomerIdForNo() {
    this.showCustomerIdField = false; // Hide Customer ID field when No is clicked
    // Remove the required validator from customerId if loanTaken is 'no'
    this.loanForm.get('customerId')?.clearValidators();
    this.loanForm.get('customerId')?.updateValueAndValidity();
  }
  onSubmit(): void {
    if (this.loanForm.valid) {
      console.log(this.loanForm.value);
    } else {
      console.log('Form is not valid');
    }
  }
  // Navigate to the next page
  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      // this.scrollToSection();
      this.scrollToTop('loan-container');
    }
  }

  // Navigate to the previous page
  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      // this.scrollToSection();
      this.scrollToTop('loan-container');
    }
  }

  // scrollToSection() {
  //   if (this.currentPage === 1) {
  // this.scrollToTop('loanfirstpart');
  //   } else if (this.currentPage === 2) {
  //     this.scrollToTop('loansecondpart');
  //   }
  // }

  scrollToTop(sectionId: string) {
    const container = document.getElementById(sectionId);
    if (container) {
      console.log(container);
      container.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  // Calculate total income
  calculateIncomeTotal() {
    this.incomeTotal = +this.loanForm.value.incomeApplicant
      + +this.loanForm.value.incomeOthers1
      + +this.loanForm.value.incomeOthers2
      + +this.loanForm.value.incomeOthers3;
    this.loanForm.patchValue({
      incomeTotal: this.incomeTotal
    });
    this.calculateNetIncome();
  }

  // Calculate total expenditure
  calculateExpenditureTotal() {
    this.expenditureTotal = +this.loanForm.value.rent
      + +this.loanForm.value.loan
      + +this.loanForm.value.education
      + +this.loanForm.value.others;
    this.loanForm.patchValue({
      expenditureTotal: this.expenditureTotal
    });
    this.calculateNetIncome();
  }

  // Calculate net income
  calculateNetIncome() {
    this.netIncome = this.incomeTotal - this.expenditureTotal;
    this.loanForm.patchValue({
      netIncome: this.netIncome
    });
  }
  onSameAsCurrentChange() {
    const sameAsCurrent = this.loanForm.get('sameAsCurrent')?.value;
    console.log(this.loanForm.get('sameAsCurrent')?.value);
    if (sameAsCurrent) {
      // Copy values from temporary address to permanent address
      this.loanForm.patchValue({
        permanentAddress: this.loanForm.get('tempaddress')?.value,
        permanentCity: this.loanForm.get('tempcity')?.value,
        permanentState: this.loanForm.get('tempstate')?.value,
        permanentLocation: this.loanForm.get('templocation')?.value,
        permanentLandmark: this.loanForm.get('templandmark')?.value,
        permanentStayedOfYears: this.loanForm.get('tempstayedOfYears')?.value,
        permanentPincode: this.loanForm.get('temppincode')?.value,
      });

      // Make permanent address fields readonly
      this.isPermanentAddressSame = true;
    } else {
      // Clear the permanent address fields and make them editable
      this.loanForm.patchValue({
        permanentAddress: '',
        permanentCity: '',
        permanentState: '',
        permanentLocation: '',
        permanentLandmark: '',
        permanentStayedOfYears: '',
        permanentPincode: '',
      });
      // Make permanent address fields editable
      this.isPermanentAddressSame = false;
    }
  }

  UpdatedAddresses() {
    this.loanForm.get('tempaddress')?.valueChanges.subscribe(() => this.updatePermanentAddress());
    this.loanForm.get('tempcity')?.valueChanges.subscribe(() => this.updatePermanentAddress());
    this.loanForm.get('tempstate')?.valueChanges.subscribe(() => this.updatePermanentAddress());
    this.loanForm.get('templocation')?.valueChanges.subscribe(() => this.updatePermanentAddress());
    this.loanForm.get('templandmark')?.valueChanges.subscribe(() => this.updatePermanentAddress());
    this.loanForm.get('tempstayedOfYears')?.valueChanges.subscribe(() => this.updatePermanentAddress());
    this.loanForm.get('temppincode')?.valueChanges.subscribe(() => this.updatePermanentAddress());
  }
  // Update permanent address fields if 'Same as Current Address' is checked
  updatePermanentAddress() {
    if (this.loanForm.get('sameAsCurrent')?.value) {
      this.loanForm.patchValue({
        permanentAddress: this.loanForm.get('tempaddress')?.value,
        permanentCity: this.loanForm.get('tempcity')?.value,
        permanentState: this.loanForm.get('tempstate')?.value,
        permanentLocation: this.loanForm.get('templocation')?.value,
        permanentLandmark: this.loanForm.get('templandmark')?.value,
        permanentStayedOfYears: this.loanForm.get('tempstayedOfYears')?.value,
        permanentPincode: this.loanForm.get('temppincode')?.value,
      });
    }
  }
  // Method to check if a form control is invalid and touched or dirty
  isFieldInvalid(field: string): boolean {
    const control = this.loanForm.get(field);
    return !!(control && control.invalid && (control.touched || control.dirty));
  }
  sendData() {
    // Check if the form is valid
    if (this.loanForm.valid) {
      // Populate the LoanModel object with form data
      this.LoanModelObj.title = this.loanForm.value.title;
      this.LoanModelObj.fullname = this.loanForm.value.fullname;
      this.LoanModelObj.fatherName = this.loanForm.value.fathersOrSpousesName;
      this.LoanModelObj.dateOfBirth = this.loanForm.value.dob;
      this.LoanModelObj.gender = this.loanForm.value.gender;
      this.LoanModelObj.maritalStatus = this.loanForm.value.maritalStatus;
      this.LoanModelObj.mailId = this.loanForm.value.email;
      this.LoanModelObj.higherQualification = this.loanForm.value.highestQualification;
      // this.LoanModelObj.noOfDependents = this.loanForm.value.dependents;
      this.LoanModelObj.category = this.loanForm.value.category;
      this.LoanModelObj.religion = this.loanForm.value.religion;
      this.LoanModelObj.panCardNumber = this.loanForm.value.panCard;
      this.LoanModelObj.aadharNumber = this.loanForm.value.adhaarNumber;
      this.LoanModelObj.passportNumber = this.loanForm.value.passportNumber;
      this.LoanModelObj.voterIdNumber = this.loanForm.value.voterId;
      this.LoanModelObj.drivingLicenseNumber = this.loanForm.value.drivingLicense;
      this.LoanModelObj.gstNumber = this.loanForm.value.gstNumber;
      this.LoanModelObj.mobileNumber = this.loanForm.value.mobileNumber;

      // Current Address Mapping
      this.LoanModelObj.currentAddress = new CurrentAddress();
      this.LoanModelObj.currentAddress.address = this.loanForm.value.tempaddress;
      this.LoanModelObj.currentAddress.city = this.loanForm.value.tempcity;
      this.LoanModelObj.currentAddress.state = this.loanForm.value.tempstate;
      this.LoanModelObj.currentAddress.location = this.loanForm.value.templocation;
      this.LoanModelObj.currentAddress.landmark = this.loanForm.value.templandmark;
      this.LoanModelObj.currentAddress.stayedOfYears = this.loanForm.value.tempstayedOfYears;
      this.LoanModelObj.currentAddress.pincode = this.loanForm.value.temppincode;

      // Permanent Address Mapping (Check if 'sameAsCurrent' is true)
      if (this.loanForm.value.sameAsCurrent) {
        this.LoanModelObj.permanentAddress = { ...this.LoanModelObj.currentAddress }; // Copy current address to permanent address
      } else {
        this.LoanModelObj.permanentAddress = new PermanentAddress();
        this.LoanModelObj.permanentAddress.address = this.loanForm.value.permanentAddress;
        this.LoanModelObj.permanentAddress.city = this.loanForm.value.permanentCity;
        this.LoanModelObj.permanentAddress.state = this.loanForm.value.permanentState;
        this.LoanModelObj.permanentAddress.location = this.loanForm.value.permanentLocation;
        this.LoanModelObj.permanentAddress.landmark = this.loanForm.value.permanentLandmark;
        this.LoanModelObj.permanentAddress.stayedOfYears = this.loanForm.value.permanentStayedOfYears;
        this.LoanModelObj.permanentAddress.pincode = this.loanForm.value.permanentPincode;
      }

      // Banking Details Mapping
      this.LoanModelObj.bankingDetails = new BankingDetails();
      this.LoanModelObj.bankingDetails.accountHolder = this.loanForm.value.baccountHolder;
      this.LoanModelObj.bankingDetails.branchName = this.loanForm.value.bbranchName;
      this.LoanModelObj.bankingDetails.accountNo = this.loanForm.value.baccountNo;
      // this.LoanModelObj.bankingDetails.salary = this.loanForm.value.salary;
      this.LoanModelObj.bankingDetails.accountType = this.loanForm.value.BAcctype;
      this.LoanModelObj.bankingDetails.dateOfOpening = this.loanForm.value.bdateOfOpening;
      this.LoanModelObj.bankingDetails.ifscCode = this.loanForm.value.ifsccode;

      // Applicant Proofs (Address Proof, Age Proof, etc.)
      this.LoanModelObj.applicant = [
        {
          proof: 'Address Proof',
          document: this.loanForm.value.ApplicantAddressdocumentproof,
          number: this.loanForm.value.applicantAddressNumberProof,
          issueDate: this.loanForm.value.applicantAddressIssueDateProof,
          expDate: this.loanForm.value.applicantAddressExpDateProof
        },
        {
          proof: 'Age Proof',
          document: this.loanForm.value.applicantAgeDocumentProof,
          number: this.loanForm.value.applicantAgeNumberProof,
          issueDate: this.loanForm.value.applicantAgeIssueDateProof,
          expDate: this.loanForm.value.applicantAgeExpDateProof
        },
        {
          proof: 'ID Proof',
          document: this.loanForm.value.applicantIdDocumentProof,
          number: this.loanForm.value.applicantIdNumberProof,
          issueDate: this.loanForm.value.applicantIdIssueDateProof,
          expDate: this.loanForm.value.applicantIdExpDateProof
        },
        {
          proof: 'Signature Proof',
          document: this.loanForm.value.applicantSignatureDocumentProof,
          number: this.loanForm.value.applicantSignatureNumberProof,
          issueDate: this.loanForm.value.applicantSignatureIssueDateProof,
          expDate: this.loanForm.value.applicantSignatureExpDateProof
        }
        // ,
        // {
        //   proof: 'Others',
        //   document: this.loanForm.value.applicantOthersDocumentProof,
        //   number: this.loanForm.value.applicantOthersNumberProof,
        //   issueDate: this.loanForm.value.applicantOthersIssueDateProof,
        //   expDate: this.loanForm.value.applicantOthersExpDateProof
        // }
      ];

      // Loan Details Mapping
      this.LoanModelObj.detailsOfLoanAppliedFor = new LoanDetails();
      this.LoanModelObj.detailsOfLoanAppliedFor.purposeOfLoan = this.loanForm.value.purposeOfLoan;
      this.LoanModelObj.detailsOfLoanAppliedFor.loanAmountRequired = this.loanForm.value.DloanAmount;
      this.LoanModelObj.detailsOfLoanAppliedFor.tenure = this.loanForm.value.loanTenure;
      this.LoanModelObj.detailsOfLoanAppliedFor.repaymentMode = this.loanForm.value.repaymentMode;
      // Check if the loan was taken earlier and map `customerId` if applicable
      if (this.loanForm.value.loanTaken === 'yes') {
        this.LoanModelObj.detailsOfLoanAppliedFor.earlierLoanInBeacon = 'yes';
        this.LoanModelObj.detailsOfLoanAppliedFor.customerId = this.loanForm.value.customerId;
      } else {
        this.LoanModelObj.detailsOfLoanAppliedFor.earlierLoanInBeacon = 'no';
        this.LoanModelObj.detailsOfLoanAppliedFor.customerId = ''; // Reset customer ID if not applicable
      }

      // Employment Details Mapping
      this.LoanModelObj.employmentDetails = new EmploymentDetails();
      this.LoanModelObj.employmentDetails.employmentType = this.loanForm.value.empemploymentType;
      this.LoanModelObj.employmentDetails.salary = this.loanForm.value.empsalary;
      this.LoanModelObj.employmentDetails.yearsinEmployment = this.loanForm.value.empyearsinEmployment;
      this.LoanModelObj.employmentDetails.companyName = this.loanForm.value.empcompanyName;
      this.LoanModelObj.employmentDetails.companyAdrees = this.loanForm.value.empcompanyAdrees;
      this.LoanModelObj.employmentDetails.pincode = this.loanForm.value.emppincode;
      this.LoanModelObj.employmentDetails.gstDetails = this.loanForm.value.empgstDetails;


      // Income Details Mapping
      this.LoanModelObj.incomeDetails = new IncomeDetails();
      this.LoanModelObj.incomeDetails.applicantIncome = this.loanForm.value.incomeApplicant;
      this.LoanModelObj.incomeDetails.otherIncome1 = this.loanForm.value.incomeOthers1;
      this.LoanModelObj.incomeDetails.otherIncome2 = this.loanForm.value.incomeOthers2;
      this.LoanModelObj.incomeDetails.otherIncome3 = this.loanForm.value.incomeOthers3;
      this.LoanModelObj.incomeDetails.totalIncome = this.loanForm.value.incomeTotal;

      // Expenditure Details Mapping
      this.LoanModelObj.incomeDetails.expenditureRent = this.loanForm.value.rent;
      this.LoanModelObj.incomeDetails.expenditureLoan = this.loanForm.value.loan;
      this.LoanModelObj.incomeDetails.education = this.loanForm.value.education;
      this.LoanModelObj.incomeDetails.others = this.loanForm.value.others;
      this.LoanModelObj.incomeDetails.expenditureTotal = this.loanForm.value.expenditureTotal;

      // Net Income Mapping
      this.LoanModelObj.incomeDetails.netIncome = this.loanForm.value.netIncome;


      // Property Details Mapping (Loop through FormArray)
      const properties = this.loanForm.get('properties') as FormArray;
      this.LoanModelObj.propertyDetails = properties.controls.map(propertyControl => {
        const property = propertyControl.value;
        const propertyDetails = new PropertyDetails();
        propertyDetails.ownerName = property.propertyOwnerName;
        propertyDetails.propertyAddress = property.propertyLandAddress;
        propertyDetails.plotArea = property.plotArea;
        propertyDetails.builtUpArea = property.builtUpArea;
        propertyDetails.buildingAge = property.buildingAge;
        return propertyDetails;
      });

      // References Mapping (Loop through FormArray)
      const references = this.loanForm.get('references') as FormArray;
      this.LoanModelObj.references = references.controls.map(referenceControl => {
        const reference = referenceControl.value;
        const referenceDetails = new Reference();
        referenceDetails.fullName = reference.fullName;
        referenceDetails.knownForYears = reference.knownForYears;
        referenceDetails.relationship = reference.relation;
        referenceDetails.pincode = reference.pincode;
        referenceDetails.mobilenumber = reference.mobile;
        return referenceDetails;
      });

      // Loans Details Mapping (Loop through FormArray)
      const loans = this.loanForm.get('loans') as FormArray;
      this.LoanModelObj.existingLoanDetails = loans.controls.map(loanControl => {
        const loan = loanControl.value;
        const existingLoanDetails = new ExistingLoanDetails();
        existingLoanDetails.nameOfInstitution = loan.nameOfInstitution;
        existingLoanDetails.purposeOfLoan = loan.purposeOfLoan;
        existingLoanDetails.loanAmount = loan.loanAmount;
        existingLoanDetails.tenureOfLoan = loan.tenureOfLoan;
        existingLoanDetails.monthlyInstallment = loan.monthlyInstallment;
        existingLoanDetails.currentOutstanding = loan.currentOutstanding;
        existingLoanDetails.balanceTenure = loan.balanceTenure;
        return existingLoanDetails;
      });
      // Set the loading flag to true
      this.isSubmitting = true;
      // Send the populated LoanModel object to the service
      this.api.postUser(this.LoanModelObj).subscribe(response => {
        console.log('Data sent successfully:', response);
        // Save the reference ID in the service
        this.successData.setReferenceId(response.data.applicationReferenceId);
        this.isSubmitting = false; // Turn off the loader
        this.rtr.navigate(['success']);
        this.loanForm.reset();
      }, error => {
        this.isSubmitting = false; // Turn off the loader
        console.error('Error sending data:', error);
      });
    } else {
      // If the form is invalid, mark all controls as touched to show validation errors
      this.loanForm.markAllAsTouched();
      console.log('Form is not valid. Please correct the errors.');
    }
  }

  // Custom email validator
  strictEmailValidator() {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;  // Don't validate if empty
      }

      // Regular expression for stricter email validation
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      const isValid = emailRegex.test(control.value);

      return isValid ? null : { invalidEmail: true };
    };
  }



}
