import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddUserComponent } from '../add-user/add-user.component';
import { ConfirmModalComponent } from 'src/app/core/models/confirm-modal/confirm-modal.component';
import { HrmService } from 'src/app/services/hrm.service';
import { NgToastService } from 'ng-angular-popup';
import { PrivilegesService } from 'src/app/services/privileges.service';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';

@Component({
  selector: 'app-hrm-actions',
  standalone: true,
  imports: [CommonModule, AddUserComponent, ConfirmModalComponent],
  templateUrl: './hrm-actions.component.html',
  styleUrls: ['./hrm-actions.component.scss']
})

export class HrmActionsComponent {
  @Input() userId! : string;
  
  @Output() closeModal: EventEmitter<void> = new EventEmitter();
  showMainPopup = true;
  showUpdateComponent = false;
  showConfirmDialog = false;
  // customerToDelete: number | null = null;
  private hrmServ = inject(HrmService);
   private toast = inject(CustomToastService); // Inject NgToastService
  userToDelete: any;
  confirmMessage: string = '';
  mode : string = '';
  protected privilegeServ = inject(PrivilegesService);
  constructor() { }

  openUpdateComponent(msg : string): void {
   this.mode = msg;
    if (!this.userId) {
      console.error("No userId provided for update");
      return;
    }
    this.showUpdateComponent = true;
    this.showMainPopup = false;
  }

  closeUpdateComponent(): void {
    this.showUpdateComponent = false;
    this.showMainPopup = true;
  }

  openDeleteConfirmation() {
    this.userToDelete = this.userId;
    this.confirmMessage = 'Are you sure you want to delete this user?';
    this.showConfirmDialog = true;
    this.showMainPopup = false;
  }

  handleDeleteConfirmation(confirmed: boolean): void {
    this.showConfirmDialog = false;
    if (confirmed && this.userToDelete !== null) {
      this.deleteCustomer(this.userToDelete);
    } else {
      // Reopen the HRM Actions modal if the user cancels
      this.showMainPopup = true;
    }
  }
  deleteCustomer(userId: number): void {
      this.hrmServ.deleteCustomer(userId).subscribe({
        next : (response : any)=>{
          if(response.status === 'success'){
            this.toast.success({
              detail: 'Success',
              summary: 'User deleted successfully.',
              duration: 3000,
            });
            this.close();
          }
          else{
            this.toast.error({
              detail: 'Error',
              summary: 'Failed to delete user.',
              duration: 3000,
            });
          }
        },
        error : (err)=>{
          this.toast.error({
            detail: 'Error',
            summary: 'Failed to delete user.',
            duration: 3000,
          });
        }
      });
  }
  close(): void {
    this.closeModal.emit();
  }
}
