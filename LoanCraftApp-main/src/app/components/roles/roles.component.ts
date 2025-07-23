import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgToastService } from 'ng-angular-popup';
import { RolesService } from 'src/app/services/roles.service';
import { RoleActionsComponent } from './role-actions/role-actions.component';
import { ConfirmModalComponent } from 'src/app/core/models/confirm-modal/confirm-modal.component';
import { AddRoleComponent } from './add-role/add-role.component';
import { PlainNavigationComponent } from '../plain-navigation/plain-navigation.component';
import { CapitalizePipe } from 'src/app/core/pipes/capitalize.pipe';
import { AddPrivilegeComponent } from "../privilege/add-privilege/add-privilege.component";
import { PrivilegesService } from 'src/app/services/privileges.service';
import { TitleCaseDirective } from 'src/app/core/directives/title-case.directive';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';


@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [CommonModule, AddRoleComponent, RoleActionsComponent, ConfirmModalComponent, PlainNavigationComponent , CapitalizePipe , TitleCaseDirective],
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss']
})

export class RolesComponent {
  pageIndex = 0;
  pageSize = 50; // Items per page
  field = 'empty';
  sortField = 'updateddate';
  sortOrder: 'asc' | 'desc' = 'desc'; // Default sort order
  hoverField: string | null = null;
  currentPageIndex = 0;
  totalItems: number = 0;
  totalPages: number = 0;
  target: string = '';
  rolesInfo: any[] = [];
  showRoleModal = false;
  selectedRoleId: string = '';
  confirmMessage: string = '';
  showConfirmDialog = false;
  showAddRole = false;
  protected privilegeServ = inject(PrivilegesService);

  constructor(private roleService: RolesService, private toast: CustomToastService) { }

  ngOnInit(): void {
    this.getRoles();
  }
  openAddRole(msg: string) {
    this.target = msg;
    this.showAddRole = true;
  }
  closeAddRole(): void {
    this.showAddRole = false;
    this.getRoles();
  }
  openRoleModal(roleId: string): void {
    this.selectedRoleId = roleId;
    this.showRoleModal = true;
  }
  closeRoleModal() {
    this.showRoleModal = false;
    this.getRoles();
  }

  // deleteRole(roleId: number): void {
  //   this.roleService.deleteRole(roleId).subscribe({
  //     next: (res: any) => {
  //       if (res.status === 'success') {
  //         this.toast.success({
  //           detail: 'Success',
  //           summary: 'Role deleted successfully',
  //           duration: 3000
  //         });
  //         this.getRoles();
  //       } else {
  //         this.toast.error({
  //           detail: 'Error',
  //           summary: res.message || 'Failed to delete role. Please try again.',
  //           duration: 3000
  //         });
  //       }
  //     },
  //     error: (error: any) => {
  //       console.error('Error deleting role', error);
  //       this.toast.error({
  //         detail: 'Error',
  //         summary: 'Failed to delete role. Please try again.',
  //         duration: 3000
  //       });
  //     }
  //   });
  // }

  onSort(field: string): void {
    if (this.sortField === field) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortOrder = 'asc';
    }
    this.getRoles();
  }
  getSortIcon(field: string): string {
    if (this.sortField === field) {
      return this.sortOrder === 'asc' ? 'bi bi-arrow-down' : 'bi bi-arrow-up';
    }
    return this.hoverField === field ? 'bi bi-arrow-up' : '';
  }
  onSearch(event: any): void {
    const keyword = event.target.value.trim();
    this.field = keyword;
    this.currentPageIndex = 0;
    if (keyword !== '') {
      const requestPayload = {
        pageNumber: 1,
        pageSize: this.pageSize,
        sortField: this.sortField,
        sortOrder: this.sortOrder,
        keyword: keyword,
      };

      this.roleService.getAllRoles(requestPayload).subscribe(
        (response: any) => {
          if (response && response.data && Array.isArray(response.data.content)) {
            this.rolesInfo = response.data.content;
            this.totalItems = response.data.totalElements;
            this.totalPages = Math.ceil(this.totalItems / this.pageSize);
            if (this.totalPages === 0) {
              this.currentPageIndex = 0;
            }
            this.rolesInfo.map((x: any, i) => {
              x.serialNum = this.generateSerialNumber(i);
            });
          } else {
            console.warn('No roles data received.');
            this.rolesInfo = [];
            this.totalItems = 0;
            this.totalPages = 1;
          }
        },
        error => {
          console.error('Error fetching roles:', error);
          this.rolesInfo = [];
          this.totalItems = 0;
          this.totalPages = 1;
        }
      );
    } else {
      this.getRoles(this.currentPageIndex + 1);
    }
  }

  getRoles(pageIndex = 1): void {
    const requestPayload = {
      pageNumber: pageIndex,
      pageSize: this.pageSize,
      sortOrder: this.sortOrder,
      sortField: this.sortField,
      keyword: this.field
    };

    this.roleService.getAllRoles(requestPayload).subscribe({
      next: (response: any) => {
        if (response && response.data && Array.isArray(response.data.content)) {
          this.rolesInfo = response.data.content;
          this.totalItems = response.data.totalElements;
          this.totalPages = Math.ceil(this.totalItems / this.pageSize);

          this.rolesInfo.forEach((role: any, i: number) => {
            role.serialNum = this.generateSerialNumber(i);
          });
        } else {
          this.rolesInfo = [];
          this.totalItems = 0;
          this.totalPages = 1;
        }
      },
      error: (error) => {
        console.error('Error fetching roles:', error);
        this.rolesInfo = [];
        this.totalItems = 0;
        this.totalPages = 1;
      }
    });
  }

  generateSerialNumber(index: number): number {
    return this.currentPageIndex * this.pageSize + index + 1;
  }

  goToFirstPage(): void {
    if (this.currentPageIndex > 0) {
      this.currentPageIndex = 0;
      this.getRoles(this.currentPageIndex + 1);
    }
  }

  goToPreviousPage(): void {
    if (this.currentPageIndex > 0) {
      this.currentPageIndex--;
      this.getRoles(this.currentPageIndex + 1);
    }
  }

  goToNextPage(): void {
    if (this.currentPageIndex < this.totalPages - 1) {
      this.currentPageIndex++;
      this.getRoles(this.currentPageIndex + 1);
    }
  }

  goToLastPage(): void {
    if (this.currentPageIndex < this.totalPages - 1) {
      this.currentPageIndex = this.totalPages - 1;
      this.getRoles(this.currentPageIndex + 1);
    }
  }
}
