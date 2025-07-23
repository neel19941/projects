import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgToastService } from 'ng-angular-popup';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { PlainNavigationComponent } from '../plain-navigation/plain-navigation.component';
import { EmployerService } from 'src/app/services/employer.service';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';

@Component({
  selector: 'app-employer-login',
  standalone: true,
  imports: [CommonModule,
        FormsModule,
        ReactiveFormsModule,
        PlainNavigationComponent
  ],
  templateUrl: './employer-login.component.html',
  styleUrls: ['./employer-login.component.scss']
})

export class EmployerLoginComponent {
  loginForm!: FormGroup;
  submitted = false;
  isPasswordVisible = false;
  private toast = inject(CustomToastService);
  private empServ = inject(EmployerService);

  constructor(private fb: FormBuilder, private auth: AuthService, private rtr: Router) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  togglePasswordVisibility(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  login(): void {
    this.submitted = true;
    if (this.loginForm.valid) {
      const employerCredentials = {
        username: this.loginForm.value.email,
        password: this.loginForm.value.password
      };
       this.empServ.postEmployer(employerCredentials).subscribe({
        next : (response : any)=>{
           if(response.status === "success"){
            localStorage.setItem("userId" ,  response.data.userid);
            localStorage.setItem("firstname" , response.data.fullname);
            // localStorage.setItem("role" , response.data.roles);
            localStorage.setItem("rolePrivilege" , response.data.rolePrivileges);
            localStorage.setItem("roleid" , response.data.roleno);
            this.toast.success({ detail: "SUCCESS", summary: 'Login successfull!', duration: 5000 });
            // this.rtr.navigate(['body/employer-dashboard']);
            this.auth.storeToken(response.data.token , response.data.roles); // Store the token and role
            this.rtr.navigate(['top-navbar/employer-dashboard']);
            this.loginForm.reset();
           }else{
            this.toast.error({ detail: "Error", summary:'Invalid credentials. Please try again.', duration: 5000 });
           }
        },error : (err)=>{
          this.toast.error({ detail: "Error", summary:'Login failed. Please try again.', duration: 5000 });
        }
       });
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
