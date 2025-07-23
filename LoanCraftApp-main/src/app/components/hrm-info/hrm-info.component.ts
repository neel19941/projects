import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgToastService } from 'ng-angular-popup';
import { HrmService } from 'src/app/services/hrm.service';
import { AddUserComponent } from './add-user/add-user.component';
import { HrmActionsComponent } from './hrm-actions/hrm-actions.component';
import { CapitalizePipe } from 'src/app/core/pipes/capitalize.pipe';
import { PrivilegesService } from 'src/app/services/privileges.service';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';


@Component({
  selector: 'app-hrm-info',
  standalone: true,
  imports: [CommonModule,
    AddUserComponent,
    HrmActionsComponent , 
    CapitalizePipe
  ],
  templateUrl: './hrm-info.component.html',
  styleUrls: ['./hrm-info.component.scss']
})
export class HrmInfoComponent {
  pageIndex = 0;
  pageSize = 50; // items per page
  field = 'empty';
  sortField = 'name';
  sortOrder: 'asc' | 'desc' = 'desc'; // Default sort order
  hoverField: string | null = null; // To track which column is being hovered
  currentPageIndex = 0;
  itemsPerPage = 50;
  totalItems: number = 0;
  totalPages: number = 0; // Total pages
  hrmInfo: any[] = [];
  private toast = inject(CustomToastService);
  showHRMUpdationModal = false;
  showHrmActionModal = false;
  hrmToDelete: number | null = null;
  showConfirmDialog = false;
  showAddUser = false;
  mode: string = '';
  selectedUserId: string = '';
  confirmMessage: string = '';
  protected privilegeServ = inject(PrivilegesService);

  constructor(private hrmServ: HrmService) { }

  ngOnInit(): void {
    this.getHrmInfo();
  }

  openAddUser(msg: string) {
    this.mode = msg;
    this.showAddUser = true;
  }

  closeAddUser(): void {
    this.showAddUser = false;
    this.getHrmInfo();
  }

  openHrmActionModal(userId: string): void {
    this.selectedUserId = userId; // Ensure userId is assigned
    this.showHrmActionModal = true;
  }

  closeHrmActionModal(): void {
    this.showHrmActionModal = false;
    this.getHrmInfo();
  }

  deleteHRMInfo(hrmId: number): void {
    this.hrmServ.deleteCustomer(hrmId).subscribe({
      next: (res: any) => {
        if (res.status === 'success') {
          console.log('HRM information deleted successfully', res);
          this.toast.success({
            detail: 'Success',
            summary: 'HRM information deleted successfully',
            duration: 3000,
          });
          this.getHrmInfo(this.currentPageIndex + 1); // Reload the data
        } else {
          this.toast.error({
            detail: 'Error',
            summary: res.message || 'Failed to delete HRM information. Please try again.',
            duration: 3000,
          });
        }
      },
      error: (error: any) => {
        console.error('Error deleting HRM information', error);
        this.toast.error({
          detail: 'Error',
          summary: 'Failed to delete HRM information. Please try again.',
          duration: 3000,
        });
      }
    });
  }

  onSort(field: string): void {
    if (this.sortField === field) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortOrder = 'asc';
    }
    this.getHrmInfo();
  }

  onSearch(event: any): void {
    const keyword = event.target.value.trim();
    this.field = keyword;

    this.currentPageIndex = 0;
    if (keyword !== '') {
      const pagObj = {
        pageNumber: 1,
        pageSize: this.itemsPerPage,
        sortField: this.sortField,
        sortOrder: this.sortOrder,
        keyword: keyword,
      };

      this.hrmServ.postGetUsers(pagObj).subscribe(
        (response: any) => {
          if (response && response.data && Array.isArray(response.data.content)) {
            this.hrmInfo = response.data.content;
            this.totalItems = response.data.totalElements;
            this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
            if (this.totalPages === 0) {
              this.currentPageIndex = 0;
            }
            this.hrmInfo.map((x: any, i) => {
              x.serialNum = this.generateSerialNumber(i);
            });
          } else {
            console.warn('No HRM data received.');
            this.hrmInfo = [];
            this.totalItems = 0;
            this.totalPages = 1;
          }
        },

        error => {
          console.error('Error fetching HRM data:', error);
          this.hrmInfo = [];
          this.totalItems = 0;
          this.totalPages = 1;
        }
      );
    } else {
      this.getHrmInfo(this.currentPageIndex + 1);
    }
  }

  getHrmInfo(pagIdx = 1): void {
    const requestPayload = {
      pageNumber: pagIdx,
      pageSize: this.itemsPerPage,
      sortOrder: this.sortOrder,
      sortField: this.sortField,
      keyword: this.field
    };

    this.hrmServ.postGetUsers(requestPayload).subscribe(
      response => {
        if (response && response.data && Array.isArray(response.data.content)) {
          this.hrmInfo = response.data.content;
          this.totalItems = response.data.totalElements;
          this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
          if (this.totalPages > 0 && this.currentPageIndex >= this.totalPages) {
            this.currentPageIndex = this.totalPages - 1;
          }
          this.hrmInfo.forEach((x: any, i: number) => {
            x.serialNum = this.generateSerialNumber(i);
          });
        } else {
          console.warn('No HRM data received.');
          this.hrmInfo = [];
          this.totalPages = 1;
        }
      },
      error => {
        console.error('Error fetching HRM data:', error);
        this.hrmInfo = [];
        this.totalPages = 1;
      }
    );
  }

  generateSerialNumber(index: number): number {
    return this.currentPageIndex * this.itemsPerPage + index + 1;
  }

  getSortIcon(field: string): string {
    if (this.sortField === field) {
      return this.sortOrder === 'asc' ? 'bi bi-arrow-down' : 'bi bi-arrow-up';
    }
    return this.hoverField === field ? 'bi bi-arrow-up' : '';
  }

  goToFirstPage(): void {
    if (this.currentPageIndex > 0) {
      this.currentPageIndex = 0;
      this.getHrmInfo(this.currentPageIndex + 1);
    }
  }

  goToPreviousPage(): void {
    if (this.currentPageIndex > 0) {
      this.currentPageIndex--;
      this.getHrmInfo(this.currentPageIndex + 1);
    }
  }

  goToNextPage(): void {
    if (this.currentPageIndex < this.totalPages - 1) {
      this.currentPageIndex++;
      this.getHrmInfo(this.currentPageIndex + 1);
    }
  }

  goToLastPage(): void {
    if (this.currentPageIndex < this.totalPages - 1) {
      this.currentPageIndex = this.totalPages - 1;
      this.getHrmInfo(this.currentPageIndex + 1);
    }
  }
}
