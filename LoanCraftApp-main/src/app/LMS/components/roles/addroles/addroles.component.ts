import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RolesService } from 'src/app/LMS/services/roles.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-addroles',
  templateUrl: './addroles.component.html',
  styleUrls: ['./addroles.component.scss'],
  standalone:true,
  imports:[CommonModule, ReactiveFormsModule]
})
export class AddrolesComponent implements OnInit {
  loginForm!: FormGroup;
  isEditMode = false; // Determines whether the component is in edit mode
  roleData: any;

  constructor(
    private fb: FormBuilder,
    private roleServ: RolesService,
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
      roleId: [this.roleData?.roleId || null], // Include `roleId` for edit mode
      roleName: [this.roleData?.roleName || '', [Validators.required, Validators.minLength(3)]],
      description: [this.roleData?.description || '', [Validators.maxLength(255)]]
    });
  }

  saveRole(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    if (this.isEditMode) {
      // Update role
      this.roleServ.updateRole(this.loginForm.value).subscribe({
        next: () => {
          alert('Role updated successfully!');
          this.router.navigate(['/roles']);
        },
        error: (err) => {
          alert('Failed to update role: ' + err.message);
        }
      });
    } else {
      // Add new role
      this.roleServ.addRole(this.loginForm.value).subscribe({
        next: () => {
          alert('Role added successfully!');
          this.router.navigate(['/roles']);
        },
        error: (err) => {
          alert('Failed to add role: ' + err.message);
        }
      });
    }
  }
}
