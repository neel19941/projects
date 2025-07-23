import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { LoanService } from 'src/app/services/loan.service';
import { NgToastService } from 'ng-angular-popup';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule , RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  private Eligibility: any;
  private checkBtn: boolean = false;

  constructor(private loanServ : LoanService , private toast : CustomToastService , private rtr : Router) { }

  ngOnInit(): void {
    this.getId();
    this.EligibilityCheckForLoan();
  }
  
  getId(){
    return localStorage.getItem("customerId");
   }

   EligibilityCheckForLoan() {
    const customerId = this.getId();
    
    if (customerId) { // Check if customerId is not null or undefined
      this.loanServ.checkEligibility(customerId).subscribe({
        next: (data) => {

          this.Eligibility = data; 
          console.log('Eligibility data received:', this.Eligibility);

          if(data.status === "Fail"){
              this.checkBtn = true;
              console.log("The person not eigibile for loan and status is Fail");
          }else{
            this.checkBtn = false;
            console.log("The person is eigibile for loan and status is true");
          }
        },
        error: (err) => {
          console.error('Error checking eligibility:', err);
        }
      });
    } else {
      console.error('Customer ID not found in localStorage.');
    }
  }
  
  checkPersonalLoanMethod(){
    // this.rtr.navigate(['body/application']);
       if(this.checkBtn){
        this.rtr.navigate(['body/dashboard']);
        this.toast.error({
          detail: 'Error',
          summary: 'Failed to apply Loan. Please update Profile.',
          duration: 3000,
        });
       }else{
        this.rtr.navigate(['body/application']);
       }
  }
}
