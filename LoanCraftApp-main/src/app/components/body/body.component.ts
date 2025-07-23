import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { SharedModalComponent } from '../shared-modal/shared-modal.component';
import { PersonalInfoComponent } from '../personal-info/personal-info.component';
import { ApiService } from 'src/app/core/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { CapitalizePipe } from 'src/app/core/pipes/capitalize.pipe';

@Component({
  selector: 'app-body',
  standalone: true,
  imports: [CommonModule, CapitalizePipe, RouterModule, PersonalInfoComponent],
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.scss']
})

export class BodyComponent {

  firstname!: string;
  lastname!: string;
  role!: string;
  menus = true;
  activeTab: string = 'home'; // default
  private router = inject(Router);
  constructor(private auth: AuthService) { }

  ngOnInit(): void {
    this.getUserNames(); // Ensure this is called when the component initializes
    this.role = this.getRole();
    this.loadMenus();
    window.addEventListener('storage', () => {
      this.getUserNames();
    });
  }

  showModal = false;
  
  openModal(): void {
    this.showModal = true; // Open the modal
  }
  closeModal(): void {
    this.showModal = false; // Close the modal
  }
  navigateToRoles() {
    this.router.navigate(['/body/roles'])
  }
  navigateToApprovedLists(){
    this.router.navigate(['/body/approved-lists'])
  }
  logout() {
    if(this.role === "EMPLOYEE"){
      this.router.navigate(['/employer-login'])
    }else{
      this.auth.isLogOut();
    }
   
  }
  redirectToDashboard() {
      this.activeTab = 'home';
    if (this.role === "EMPLOYEE") {
      this.router.navigate(['/body/employer-dashboard'])
    } else {
      this.router.navigate(['/body/dashboard'])
    }
  }
  navigateToHrm() {
      this.activeTab = 'hrm';
    this.router.navigate(['/body/hrm-info'])
  }
  navigateToCustomes() {
      this.activeTab = 'customers';
    this.router.navigate(['/body/customer-info'])
  }
  navigateToProfile() {
        this.activeTab = 'profile';
    this.router.navigate(['/body/profile'])
  }
  navigateToApplications(){
    this.router.navigate(['/body/application-nav']);
  }
  navigateToSanctionedLists(){
    this.router.navigate(['/body/sanctioned-lists'])
  }
  navigateTocustomerApplications(){
    this.router.navigate(['/body/customer-applications'])
  }
  getRole() {
    return localStorage.getItem("role") || '';
  }
  loadMenus() {
    if (this.role === "EMPLOYEE") {
      this.menus = true;
      // alert(this.menus);
    } else {
      this.menus = false;
    }
  }
  getUserNames(): void {
    this.firstname = localStorage.getItem("firstname") || ''; // Default to empty string if null
    this.lastname = localStorage.getItem("lastname") || ''; // Default to empty string if null

  }
}
