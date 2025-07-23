import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PrivilegesService } from 'src/app/LMS/services/privileges.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-addprivilege',
  templateUrl: './addprivilege.component.html',
  styleUrls: ['./addprivilege.component.scss'],
  standalone:true,
  imports:[CommonModule, ReactiveFormsModule]
})
export class AddprivilegeComponent {

  loginForm!: FormGroup;
  isEditMode = false; // Determines whether the component is in edit mode
  roleData: any;

  constructor(
    private fb: FormBuilder,
    private privServ: PrivilegesService,
    private router: Router
  ) {
    // Check for role data passed via router's state
    const navigation = this.router.getCurrentNavigation();
    this.roleData = navigation?.extras.state?.['roleData'];
    this.isEditMode = !!this.roleData;
  }

  ngOnInit(): void {
    // Initialize the form
    this.loginForm = this.fb.group({
      
      type: ['', [Validators.required]],
      name: ['', [Validators.required,]],
      cardType: ['', [Validators.required]]
    });
  }

  savePrivilege(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    // Add new Privilege
    this.privServ.addPrivilege(this.loginForm.value).subscribe({
      next: () => {
       
        this.router.navigate(['/privileges']);
      },
      error: (err) => {
        
      }
    });
  }
  

}
