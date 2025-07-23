import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RolesService } from 'src/app/services/roles.service';
import { NgToastService } from 'ng-angular-popup';
import { TitleCaseDirective } from 'src/app/core/directives/title-case.directive';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';

@Component({
  selector: 'app-add-role',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule , TitleCaseDirective],
  templateUrl: './add-role.component.html',
  styleUrls: ['./add-role.component.scss']
})

export class AddRoleComponent {
  @Input() target!: string;
  @Input() roleId!: string;
  @Output() closeModal: EventEmitter<void> = new EventEmitter();
  addRoleForm!: FormGroup;
  title: string = 'Add Role';
  isEditMode: boolean = false;
  private roleService = inject(RolesService);
  private toast = inject(CustomToastService);
  private data: any;

  constructor(private fb: FormBuilder) { }

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
      rolename: ['', [Validators.required, Validators.pattern(/^[a-zA-Z ]{5,}$/)]],
      description: ['']
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
      rolename: this.toTitleCase(data.data.roleName || ''),
      description: this.toTitleCase(data.data.description || '')
    });
  }
  toTitleCase(value: string): string {
    if (!value) return '';
    return value
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
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
}
