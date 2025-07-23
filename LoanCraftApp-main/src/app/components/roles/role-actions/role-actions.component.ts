import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgToastService } from 'ng-angular-popup';
import { RolesService } from 'src/app/services/roles.service';
import { ConfirmModalComponent } from 'src/app/core/models/confirm-modal/confirm-modal.component';
import { AddRoleComponent } from '../add-role/add-role.component';
import { Router } from '@angular/router';
import { PrivilegesService } from 'src/app/services/privileges.service';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';

@Component({
  selector: 'app-role-actions',
  standalone: true,
  imports: [CommonModule , AddRoleComponent ,ConfirmModalComponent],
  templateUrl: './role-actions.component.html',
  styleUrls: ['./role-actions.component.scss']
})
export class RoleActionsComponent {

@Input() roleId! : string;
 @Output() closeModal: EventEmitter<void> = new EventEmitter();
  showMainPopup = true;
  showUpdateComponent = false;
  showConfirmDialog = false;
  // customerToDelete: number | null = null;
  private roleServ = inject(RolesService);
   private toast = inject(CustomToastService); // Inject NgToastService
  roleToDelete: any;
  confirmMessage: string = '';
  // mode : string = '';
  target : string = '';
   protected privilegeServ = inject(PrivilegesService);

  private router = inject(Router);
  constructor() { }

  openUpdateComponent(msg : string): void {
   this.target = msg;
    if (!this.roleId) {
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

  getUserId() {
    return localStorage.getItem("userId");
  }

  openDeleteConfirmation() {
    this.roleToDelete = this.roleId;
    this.confirmMessage = 'Are you sure you want to delete this user?';
    this.showConfirmDialog = true;
    this.showMainPopup = false;
  }

  handleDeleteConfirmation(confirmed: boolean): void {
    this.showConfirmDialog = false;
    if (confirmed && this.roleToDelete !== null) {
      this.deleteRole(this.roleToDelete);
    } else {
      // Reopen the HRM Actions modal if the user cancels
      this.showMainPopup = true;
    }
  }
  deleteRole(roleId: number): void {
      this.roleServ.deleteRole(roleId).subscribe({
        next : (response : any)=>{
          if(response.status === "success"){
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
          this.close();
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

  openPrivileges(roleId:any) {
    // this.router.navigateByUrl('body/privileges',roleId);
    // this.router.navigate(['/body/privileges', roleId]);
    this.router.navigate(['/top-navbar/privileges', roleId]);
    }

}
