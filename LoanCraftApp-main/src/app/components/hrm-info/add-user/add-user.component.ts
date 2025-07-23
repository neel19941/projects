import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgToastService } from 'ng-angular-popup';
import { HrmService } from 'src/app/services/hrm.service';
import { RolesService } from 'src/app/services/roles.service';
import { CapitalizePipe } from 'src/app/core/pipes/capitalize.pipe';
import { TitleCaseDirective } from 'src/app/core/directives/title-case.directive';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';
@Component({
  selector: 'app-add-user',
  standalone: true,
  imports: [CommonModule, CapitalizePipe , FormsModule, TitleCaseDirective ,ReactiveFormsModule],
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})

export class AddUserComponent {

  @Input() userId!: string; // Receive userId
  @Input() mode!: string;
  @Output() closeModal: EventEmitter<void> = new EventEmitter();
  addUserForm!: FormGroup;
  private data: any;
  title: string = 'Add User';
  roles: any[] = [];  // Array to hold roles
  private hrmServ = inject(HrmService);
  private toast = inject(CustomToastService); // Inject NgToastService
  private role = inject(RolesService);
  showPassword = false; // Toggle state
  paswordField = true;
  isEditMode: boolean = false;  // By default, it's add mode
  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.initializeForm(); // Initialize the form
    this.getRoles();
    // Only load user data if in update mode
    if (this.mode === 'update' && this.userId) {
      this.loadUserData();
      this.title = "Update User"
      this.paswordField = false;
      this.isEditMode = true;
    }
  }

  // Initialize the form
  private initializeForm(): void {
    this.addUserForm = this.fb.group({
      // name: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\s]+$/), Validators.minLength(4)]],
      name : ['', [Validators.required, Validators.pattern(/^(?!\s*$)[a-zA-Z\s]{4,}$/)]],
      // email: ['', [Validators.required, Validators.email]],
       email: ['', [Validators.required,Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]],
      // mobileNumber: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
       mobileNumber: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/)]],
      role: ['', [Validators.required]],
      // department: ['', [Validators.required]],
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  private loadUserData(): void {
    if (!this.userId) {
      console.error('User ID not found.');
      return;
    }

    this.hrmServ.findUserById(this.userId).subscribe({
      next: (data) => {
        this.data = data;
        console.log('Fetched Data:', this.data);
        this.populateForm(this.data);
      },
      error: (error) => {
        console.error('Error fetching user data:', error);
      }
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
  // Populate the form with fetched data
  private populateForm(data: any): void {
    console.log(data.data);
    this.addUserForm.patchValue({
      name: this.toTitleCase(data.data.name || ''),
      email: data.data.email || '',
      mobileNumber: data.data.mobileNumber || '',
      password: data.data.password || '',
      role: data.data.roles.length > 0 ? data.data.roles[0].roleId : '', // Fix here
      // department: data.data.department || ''
    });
  }

  // Fetch roles dynamically from API
  getRoles() {
    this.role.getroles().subscribe({
      next: (response: any) => {
        if (response.status === 'success' && response.data) {
          this.roles = response.data;  // Populate roles array
        }
      },
      error: (err) => {
        this.toast.error({ detail: "Error", summary: "Unable to fetch roles.", duration: 3000 });
      }
    });
  }
  getUserId() {
    return localStorage.getItem("userId");
  }
  sendData() {
    if (this.addUserForm.valid) {
      const userData = {
        name: this.addUserForm.value.name,
        email: this.addUserForm.value.email,
        mobileNumber: this.addUserForm.value.mobileNumber,
        password: this.addUserForm.value.password,
        roleId: this.addUserForm.value.role,
        addedBy: this.getUserId()
        // department : this.addUserForm.value.department
      }
      this.hrmServ.addUser(userData).subscribe({
        next: (response: any) => {
          this.toast.success({
            detail: 'Success',
            summary: 'User added successfully.',
            duration: 3000,
          });
          this.close();
        },
        error: (error) => {
          console.error('Error adding user:', error);
          this.toast.error({
            detail: 'Error',
            summary: 'Failed to add user.',
            duration: 3000,
          });
        }
      });
    } else {
      console.log('Form is not valid. Please correct the errors.');
      this.toast.error({
        detail: 'Error',
        summary: 'Form is not valid. Please correct the errors.',
        duration: 3000,
      });
      this.markAllFieldsTouched();
    }
  }
  updateData() {
    // Create an object excluding the password field
    const { password, ...validFields } = this.addUserForm.value;
    // Check if all fields except password are valid
    const isValid = Object.keys(validFields).every((key) => {
      const control = this.addUserForm.get(key);
      return control && control.valid;
    });
    if (isValid) {
      const userData = {
        userId: this.userId,
        password: this.data.data.password,
        name: this.addUserForm.value.name,
        email: this.addUserForm.value.email,
        mobileNumber: this.addUserForm.value.mobileNumber,
        roleId: this.addUserForm.value.role,
        updatedBy: this.getUserId()
      };

      this.hrmServ.updateUser(userData).subscribe({
        next: (response: any) => {
          this.toast.success({
            detail: 'Success',
            summary: 'User updated successfully.',
            duration: 3000,
          });
          this.close();
        },
        error: (error) => {
          console.error('Error updating user:', error);
          this.toast.error({
            detail: 'Error',
            summary: 'Failed to update user.',
            duration: 3000,
          });
        }
      });
    } else {
      console.log('Form is not valid. Please correct the errors.');
      this.toast.error({
        detail: 'Error',
        summary: 'Form is not valid. Please correct the errors.',
        duration: 3000,
      });
      this.markAllFieldsTouched();
    }
  }

  markAllFieldsTouched(): void {
    Object.keys(this.addUserForm.controls).forEach((key) => {
      const control = this.addUserForm.get(key);
      control?.markAsTouched();
      control?.updateValueAndValidity();
    });
  }

  close(): void {
    this.closeModal.emit(); // Emit the close event
  }
}
