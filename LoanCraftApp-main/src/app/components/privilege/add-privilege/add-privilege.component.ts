import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RolesService } from 'src/app/services/roles.service';
import { NgToastService } from 'ng-angular-popup';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PrivilegesService } from 'src/app/services/privileges.service';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';

@Component({
  selector: 'app-add-privilege',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './add-privilege.component.html',
  styleUrls: ['./add-privilege.component.scss']
})
export class AddPrivilegeComponent {
     
@Input() target!: string;
  @Input() roleId!: string;
  @Output() closeModal: EventEmitter<void> = new EventEmitter();
  addRoleForm!: FormGroup;
  title: string = 'Add Privilege';
  isEditMode: boolean = false;
  private roleService = inject(RolesService);
  private toast = inject(CustomToastService);
  private data: any;
  constructor(
      private fb: FormBuilder,
      private privServ: PrivilegesService,
      private router: Router
    ) {
      // Check for role data passed via router's state
      const navigation = this.router.getCurrentNavigation();
    }

  ngOnInit(): void {
    this.initializeForm();
    console.log(this.isEditMode);
    if (this.target === 'update' && this.roleId) {
      this.loadRoleData();
      this.title = 'Update Role';
      this.isEditMode = true;
    }
  }

  private initializeForm(): void {
    this.addRoleForm = this.fb.group({
      cardType: ['', [Validators.required]],
      name: ['', [Validators.required]],
      type: ['', [Validators.required]],
      // rolename: ['', [Validators.required, Validators.pattern(/^[a-zA-Z ]{6,}$/)]],
      // rolename: ['', [Validators.required, Validators.pattern(/^[a-zA-Z ]{6,}$/)]],
      // cardtype: ['']
    });
  }

  private loadRoleData(): void {
    if (!this.roleId) {
      console.error('Role ID not found.');
      return;
    }
    this.roleService.getRoleById(this.roleId).subscribe({
      next: (data) => {
        this.data = data;
        this.populateForm(this.data);
      },
      error: (error) => {
        console.error('Error fetching role data:', error);
      }
    });
  }

  private populateForm(data: any): void {
    this.addRoleForm.patchValue({
      rolename: data.data.roleName || '',
      description: data.data.description || ''
    });
  }
  getUserId() {
    return localStorage.getItem("userId");
  }
  sendData(): void {
    if (this.addRoleForm.valid) {
      const roleData = {
        roleName: this.addRoleForm.value.rolename,
        description: this.addRoleForm.value.description,
        addedBy: this.getUserId()
      };
      this.roleService.addRole(roleData).subscribe({
        next: (response : any) => {
          if(response.status === "success"){
            this.toast.success({
              detail: 'Success',
              summary: 'Role added successfully.',
              duration: 3000
            });
            this.close();
          }
          else{
            this.toast.error({
              detail: 'Error',
              summary: response.message,
              duration: 3000
            });
            this.close();
          }
        },
        error: (error) => {
          console.error('Error adding role:', error);
          this.toast.error({
            detail: 'Error',
            summary: 'Failed to add role.',
            duration: 3000
          });
        }
      });
    } else {
      this.toast.error({
        detail: 'Error',
        summary: 'Form is not valid. Please correct the errors.',
        duration: 3000
      });
      this.markAllFieldsTouched();
    }
  }

  updateData(): void {
    if (this.addRoleForm.valid) {
      const roleData = {
        roleId: this.data.data.roleId,
        roleName: this.addRoleForm.value.rolename,
        description: this.addRoleForm.value.description,
        updatedBy: this.getUserId()
      }
      this.roleService.updateRole(roleData).subscribe({
        next: (response : any) => {
          if(response.status === "success"){
            this.toast.success({
              detail: 'Success',
              summary: 'Role updated successfully.',
              duration: 3000
            });
            this.close();
          }
          else{
            this.toast.error({
              detail: 'Error',
              summary: 'Failed to update role.' + response.message,
              duration: 3000
            });
          }

        },
        error: (error) => {
          console.error('Error updating role:', error);
          this.toast.error({
            detail: 'Error',
            summary: 'Failed to update role.',
            duration: 3000
          });
        }
      });
    } else {
      this.toast.error({
        detail: 'Error',
        summary: 'Form is not valid. Please correct the errors.',
        duration: 3000
      });
      this.markAllFieldsTouched();
    }
  }

  markAllFieldsTouched(): void {
    Object.keys(this.addRoleForm.controls).forEach((key) => {
      const control = this.addRoleForm.get(key);
      control?.markAsTouched();
      control?.updateValueAndValidity();
    });
  }

  close(): void {
    this.closeModal.emit();
  }

  savePrivilege(): void {
   
    if (this.addRoleForm.invalid) {
      this.addRoleForm.markAllAsTouched();
      return;
    }

    // Add new Privilege
    // this.privServ.addPrivilege(this.addRoleForm.value).subscribe({
    //   next: () => {
    //     this.router.navigate(['/body/roles']);
    //   },
    //   error: (err) => {
    //   }
    // });

    this.privServ.addPrivilege(this.addRoleForm.value).subscribe({
      next: (response : any) => {
        if(response.status === "success"){
          this.toast.success({
            detail: 'Success',
            summary: 'Privilege added successfully.',
            duration: 3000
          });
          this.close();
          // this.router.navigate(['/body/roles']);
          this.router.navigate(['/top-navbar/roles']);
          //  this.router.navigate(['/top-navbar/privileges']);
        }
        else{
          this.toast.error({
            detail: 'Error',
            summary: response.message,
            duration: 3000
          });
          // this.close();
        }
      },
      error: (error) => {
        console.error('Error adding role:', error);
        this.toast.error({
          detail: 'Error',
          summary: 'Failed to add Privilege.',
          duration: 3000
        });
      }
    });
  }

}
