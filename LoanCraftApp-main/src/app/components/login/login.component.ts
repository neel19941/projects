import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserManagementService } from 'src/app/core/services/user-management.service';
import { PermissionsService } from 'src/app/core/services/permissions.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule , ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  loginForm: FormGroup;
  isFormSubmitted = false;
  private router= inject(Router);
  private userManagementServ = inject(UserManagementService);
  private permissionServ = inject(PermissionsService);

  constructor(private fb: FormBuilder) {
    // Initialize the form group with validation
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.email]],  // You can use email validation or change to text
      password: ['', [Validators.required, Validators.minLength(6)]]  // Ensure password is at least 6 characters long
    });
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
      }, 6000);
    }
  }

  onSubmit() {
    // if loginForm is valid, call login api
    this.isFormSubmitted = true;
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.userManagementServ.login(this.loginForm.value).subscribe({
     next: (result: any) => {
        if (result.status == 'success') {
          this.showSnackbar("logged in successfully !!", 'success');
        const loggedInUserData = result.data;
     
          this.permissionServ.login(loggedInUserData).subscribe((data) => {
            const message = 'You have logged in successfully!';
            this.showSnackbar(message, 'success');
            this.router.navigate(['/dashboard']);
            // this.tost.success(message,"Success");
            // this.router.navigate(['/side-navbar']);  dashboard
          });
        }
       else if (result.status == 'invalid') {
          const message ="Invalid credentials";
          this.showSnackbar("message", 'error');
          alert("result:"+message);
          // this.tost.error(message,"Fail");
          // this.showErroNotification(message);
        }
         if(result.status == 'failed') {
          const message ="failed to login";
          alert("result:"+message);
          // this.tost.error(message,"Fail");
          // this.showErroNotification(message);
        }
      },
      error: err => {
        if (err.status == 401) {
          const message = 'Invalid Credentials, Please try with valid credentials';
          this.showSnackbar('Failed to Login. Please try again.', 'error');
          // this.showErroNotification(message);
        } 
        else if (err.status == 500) {
          const message = 'Invalid Credentials, Please try with valid credentials';
          this.showSnackbar('Invalid Credentials.', 'error');
          // this.showErroNotification(message);
        } 
        else {
          const message = 'Failed to connect Server';
          // this.showErroNotification(message);
        }
      }
  });
  }

}
