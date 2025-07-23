import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RegisterModel } from './register-model';
import { ActivatedRoute, Router } from '@angular/router';
import { RegisterService } from 'src/app/services/register.service';
import { AuthService } from 'src/app/services/auth.service';
import { NgToastService } from 'ng-angular-popup';
import { IdSaveService } from 'src/app/core/services/id-save.service';
import { PlainNavigationComponent } from '../plain-navigation/plain-navigation.component';
import { TitleCaseDirective } from 'src/app/core/directives/title-case.directive';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PlainNavigationComponent,
    TitleCaseDirective
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})

export class RegisterComponent {
  registrationForm!: FormGroup;
  registerModelObj: RegisterModel = new RegisterModel();
  showOtpField = false;
  otpSent = false; // Track if OTP has been sent
  otpVerified = false; // Track if OTP is verified
  passwordCheck = false; // By default, we assume passwords match
  isPasswordVisible = false;  // Control the visibility of the password
  isConfirmPasswordVisible = false; // Toggle for confirm password visibility
  
  private idServ = inject(IdSaveService);

  userId: string | null = null; // Store userId from URL
  constructor(private fb: FormBuilder, private api: RegisterService, private rtr: Router, private auth: AuthService, private toast: CustomToastService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.userId = params['id']; 
      console.log('Extracted User ID:', this.userId);
    });
    this.registrationForm = this.fb.group({
      firstname: ['', [Validators.required, Validators.pattern(/^(?!\s*$)[a-zA-Z\s]{4,}$/)]],
      // lastname: ['', [Validators.required, Validators.minLength(4), Validators.pattern(/^[a-zA-Z\s]+$/)]],
      lastname: ['', [Validators.required,  Validators.pattern(/^(?!\s*$)[a-zA-Z\s]{4,}$/)]],
      password: ['', [Validators.required, Validators.pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/)]],
      cpassword: ['', Validators.required],
      // email: ['', [Validators.required, Validators.email]],
      email: ['', [Validators.required,Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]],
      mobile: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
      otp: ['', [Validators.required, Validators.pattern(/^\d+$/)]], // Add OTP field validation
    });
  }

  // Toggle visibility for password or confirm password
  togglePasswordVisibility(field: 'password' | 'confirmPassword') {
    if (field === 'password') {
      this.isPasswordVisible = !this.isPasswordVisible;
    } else if (field === 'confirmPassword') {
      this.isConfirmPasswordVisible = !this.isConfirmPasswordVisible;
    }
  }

  passwordMatchValidator() {
    const password = this.registrationForm.get('password')?.value;
    const cpassword = this.registrationForm.get('cpassword')?.value;

    // Compare the password and confirm password fields
    if (password == cpassword) {
      this.passwordCheck = false;
    } else {
      this.passwordCheck = true;
    }
  }

  showSnackbar(message: string, type: 'success' | 'error') {
    const snackbar = document.getElementById('customSnackbar');
    const messageContainer = document.getElementById('notificationMessage');
    const iconContainer = document.getElementById('notificationIcon');
    if (snackbar && messageContainer && iconContainer) {
      messageContainer.textContent = message;
      snackbar.className = `custom-snackbar show ${type}`;
      iconContainer.className = type === 'success' ? 'bi bi-check-circle' : 'bi bi-exclamation-circle';
      setTimeout(() => {
        snackbar.className = snackbar.className.replace('show', '').trim();
      }, 3000);
    }
  }

  // sendOtp() {
  //   this.registerModelObj.firstName = this.registrationForm.value.firstname;
  //   this.registerModelObj.lastName = this.registrationForm.value.lastname;
  //   this.registerModelObj.mobileNumber = this.registrationForm.value.mobile;
  //   this.registerModelObj.email = this.registrationForm.value.email;
  //   this.api.checkDuplicateEmail(this.registerModelObj.email).subscribe({
  //     next: (response) => {
  //       alert(JSON.stringify(response));
  //     },
  //     error: (err) => {
  //       alert(JSON.stringify(err));
  //     }
  //   });
  //   // Send the populated LoanModel object to the service
  //   this.api.sendOtp(this.registerModelObj).subscribe(response => {
  //     console.log('OTP sent successfully:', response);
  //     // this.registrationForm.reset();
  //     if (response.status === 'Success') {
  //       this.otpSent = true; // Disable the Send OTP button
  //       this.showOtpField = true;
  //       // this.showSnackbar('OTP sent successfully!', 'success');
  //       this.toast.success({ detail: "SUCCESS", summary: 'Successfully Sent OTP', duration: 5000 });
  //     }
  //   }, error => {
  //     console.error('Error sending OTP:', error);
  //     // this.showSnackbar('Failed to send OTP. Please try again.', 'error');
  //     this.toast.warning({ detail: "Error", summary: 'Failed to send OTP. Please try again.', duration: 5000 });
  //   });
  // }

  sendOtp() {
    this.registerModelObj.firstName = this.registrationForm.value.firstname;
    this.registerModelObj.lastName = this.registrationForm.value.lastname;
    this.registerModelObj.mobileNumber = this.registrationForm.value.mobile;
    this.registerModelObj.email = this.registrationForm.value.email;

    // First API call: Check if the email exists
    this.api.checkDuplicateEmail(this.registerModelObj.email).subscribe({
      next: (response : any) => {
        if (response.data === false) {
          // Email does NOT exist, proceed with sending OTP
          this.api.sendOtp(this.registerModelObj).subscribe({
            next: (otpResponse) => {
              console.log('OTP sent successfully:', otpResponse);
              if (otpResponse.status === 'Success') {
                this.otpSent = true; // Disable the Send OTP button
                this.showOtpField = true;
                this.toast.success({ detail: "SUCCESS", summary: 'Successfully Sent OTP', duration: 5000 });
              }
            },
            error: (error) => {
              console.error('Error sending OTP:', error);
              this.toast.error({ detail: "Error", summary: 'Failed to send OTP. Please try again.', duration: 5000 });
            }
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

  validateOtp() {
    const otp = this.registrationForm.get('otp')?.value;
    this.api.validateOtp(otp).subscribe(
      (response) => {
        if (response.status === 'Success') {
          this.otpVerified = true; // Enable the Register button

          this.showSnackbar('OTP verified successfully!', 'success');
        } else {
          this.showSnackbar('Invalid OTP. Please try again.', 'error');
        }
      },
      (error) => {
        console.error('Error verifying OTP:', error);
        this.showSnackbar('Failed to verify OTP. Please try again.', 'error');
      }
    );
  }

  sendData() {
    if (this.registrationForm.valid) {
      this.registerModelObj.firstName = this.registrationForm.value.firstname;
      this.registerModelObj.lastName = this.registrationForm.value.lastname;
      this.registerModelObj.mobileNumber = this.registrationForm.value.mobile;
      // this.registerModelObj.email = this.registrationForm.value.email;
      this.registerModelObj.password = this.registrationForm.value.password;
      // Assign email only if provided
      if (this.registrationForm.value.email) {
        this.registerModelObj.email = this.registrationForm.value.email;
      }
      console.log(this.registrationForm,'registerdataaa');
      
      if (this.userId) {
        this.registerModelObj.userId = this.userId;
      }
      this.api.registerUser(this.registerModelObj).subscribe(response => {

        if (response.status === 'success') {

          console.log('Data sent successfully:', response);
          this.showSnackbar('Registration successful!', 'success');

          localStorage.setItem("firstname", this.registerModelObj.firstName);
          localStorage.setItem("lastname", this.registerModelObj.lastName);
          localStorage.setItem("customerId", response.data.customerId);
          this.auth.storeToken(response.data.token , 'customer'); // Uncomment if token storage is required

          this.rtr.navigate(['body/dashboard']);
          this.registrationForm.reset();
        } else {
          // console.error('Registration failed:', response.message);
          this.showSnackbar('Registration failed. Please try again.', 'error');
        }
      }, error => {
        // console.error('Error sending data:', error.message);
        this.showSnackbar('Registration failed. Please try again.', 'error');
      });

    } else {
      console.log('Form is not valid. Please correct the errors.');
      this.showSnackbar('Form is not valid. Please correct the errors.', 'error');
    }
  }
}
