import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { PlainNavigationComponent } from '../plain-navigation/plain-navigation.component';
import { NgToastService } from 'ng-angular-popup';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';


@Component({
  selector: 'app-customer-login',
  standalone: true,
  imports: [CommonModule, 
    FormsModule,
    ReactiveFormsModule,
    PlainNavigationComponent
  ],
  templateUrl: './customer-login.component.html',
  styleUrls: ['./customer-login.component.scss']
})
export class CustomerLoginComponent {
  loginForm!: FormGroup;
  submitted = false;
  isPasswordVisible = false;
  private toast = inject(CustomToastService);

  constructor(private fb: FormBuilder , private auth : AuthService, private rtr : Router) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      usernameOrMobile: ['', [Validators.required, this.emailOrMobileValidator]],
      password: ['', Validators.required],
    });
  }
  togglePasswordVisibility(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }
  // Custom Validator Function
emailOrMobileValidator(control: AbstractControl) {
  const value = control.value;
  if (!value) return { required: true };

  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const mobilePattern = /^[1-9]\d{9}$/;

  if (emailPattern.test(value) || mobilePattern.test(value)) {
    return null; // Valid input
  } else {
    return { invalidInput: true }; // Invalid input
  }
}
register(){
  this.rtr.navigate(['register']);
}
  login(): void {
    this.submitted = true;
    if (this.loginForm.valid) {
      const customerCredentials = {
        password: this.loginForm.value.password,
        usernameOrEmail: this.loginForm.value.usernameOrMobile
      };
  
      this.auth.customerLogin(customerCredentials).subscribe(
        response => {
          console.log("Response received: ", response);
          if (response.status === "success") {
            // Assuming you get a token or user info on success
             this.auth.storeToken(response.data.token , 'customer'); // Store the token
            this.rtr.navigate(['body']); // Redirect to the dashboard
            // this.rtr.navigate(['top-navbar/']); // Redirect to the dashboard
            localStorage.setItem("customerId", response.data.customerId);
            localStorage.setItem("firstname", response.data.firstName);
            localStorage.setItem("lastname", response.data.lastName);
            this.toast.success({
              detail: 'Success',
              summary: 'Logged in successfully.',
              duration: 3000,
            });
          } else {
            this.toast.error({ detail: "Error", summary:'Invalid credentials. Please try again.', duration: 5000 });
          }
        },
        error => {
          this.rtr.navigate(['customer-login']); // Redirect to login page in case of failure
          this.toast.error({
            detail: 'Error',
            summary: 'Failed to log in. Please provide correct credentials.',
            duration: 3000,
          });

          console.error('Login error: ', error);
          // Optionally, show an error message to the user
        }
      );
    } else {
      console.log('Form is invalid. Please provide required credentials.');
      this.loginForm.markAllAsTouched();
      this.toast.error({
        detail: 'Error',
        summary: 'Please provide your credentials.',
        duration: 3000,
      });
    }
  }
  
}
