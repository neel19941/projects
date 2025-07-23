import { Component, inject, OnInit } from '@angular/core';
import { RolesService } from '../../services/roles.service';
import { Roles } from '../../models/roles';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})


export class RolesComponent implements OnInit {

  addbtn: boolean = true;
  updatebtn: boolean = true;
  deletebtn: boolean = true;
  roles: Roles[] = [];
  filteredRoles: Roles[] = [];
  paginatedRoles: Roles[] = [];
  currentPage = 1;
  pageSize = 5; // Number of items per page
  totalPages = 1;
  searchQuery = ''; // Search input value
  private router = inject(Router);

  constructor(private roleServ: RolesService) { }

  ngOnInit(): void {
    this.getAllRoles();
  }

  showDeleteConfirmation = false;
  roleToDelete: number | null = null;

  openConfirmationDialog(roleId: number): void {
    this.showDeleteConfirmation = true;
    this.roleToDelete = roleId;
  }

  closeConfirmationDialog(): void {
    this.showDeleteConfirmation = false;
    this.roleToDelete = null;
  }

  confirmDelete(): void {
    if (this.roleToDelete !== null) {
      this.roleServ.deleteRole(this.roleToDelete).subscribe({
        next: (result: any) => {
          if (result.status === 'success') {
            this.showSnackbar("Role deleted successfully!", 'success');
            this.getAllRoles();
          }
        },
        error: (err: any) => console.log('Error deleting role:', err),
      });
      this.closeConfirmationDialog();
    }
  }


  private getAllRoles() {
    this.roleServ.getAllRoles().subscribe({
      next: (response: any) => {
        this.roles = response.data;
        this.filteredRoles = [...this.roles]; // Initialize filtered roles
        this.calculatePagination();
      },
      error: (err) => console.log(err),
    });
  }

  private calculatePagination() {
    this.totalPages = Math.ceil(this.filteredRoles.length / this.pageSize);
    this.updatePaginatedRoles();
  }

  private updatePaginatedRoles() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedRoles = this.filteredRoles.slice(startIndex, endIndex);
  }

  onSearch() {
    this.currentPage = 1; // Reset to the first page
    this.filteredRoles = this.roles.filter(role =>
      role.roleName.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
    this.calculatePagination();
  }

  goToPage(page: number) {
    this.currentPage = page;
    this.updatePaginatedRoles();
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedRoles();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedRoles();
    }
  }

  get totalPagesArray(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  editRole(role: Roles): void {
    this.router.navigate(['/add-roles'], { state: { roleData: role } });
  }

  addnewrole() {
    this.router.navigate(['/add-roles']);
  }

  roleprivileges(role: Roles) {
    this.router.navigate(['/privileges', role.roleId, role.roleName]);
  }

  showSnackbar(message: string, type: 'success' | 'error') {
    const snackbar = document.getElementById('customSnackbar');
    const messageContainer = document.getElementById('notificationMessage');
    const iconContainer = document.getElementById('notificationIcon');
    if (snackbar && messageContainer && iconContainer) {
      messageContainer.textContent = message;
      snackbar.className = `custom-snackbar show ${type}`;
      iconContainer.className = type === 'success' ? 'bi bi-check-circle' : 'bi bi-exclamation-circle';
      setTimeout(() => {
        snackbar.className = snackbar.className.replace('show', '').trim();
      }, 6000);
    }
  }

  // Function to delete the role
  deleteRole(roleId: number) {
    this.roleServ.deleteRole(roleId).subscribe(
      {
        next: (result: any) => {
          if (result.status == 'success') {
            this.showSnackbar("Deleted in successfully !!", 'success');
            // Remove the deleted role from the local list after a successful deletion
            // this.roles = this.roles.filter(role => role.roleId !== roleId);
            // this.paginateRoles(); // Recalculate pagination
            this.getAllRoles();
          }
          error: (err: any) => console.log('Error deleting role:', err)
        }
      }
    );
  }

  // Function to handle pagination of roles
  paginateRoles() {
    const pageSize = 5;
    const startIndex = (this.currentPage - 1) * pageSize;
    this.paginatedRoles = this.roles.slice(startIndex, startIndex + pageSize);
  }


}
