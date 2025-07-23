import { Component, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { PrivilegesService } from 'src/app/services/privileges.service';

@Component({
  selector: 'app-applications-nav',
  standalone: true,
  imports: [CommonModule , RouterModule],
  templateUrl: './applications-nav.component.html',
  styleUrls: ['./applications-nav.component.scss']
})
export class ApplicationsNavComponent {

  isVerificationDropdownOpen: boolean = false;
  protected privilegeServ = inject(PrivilegesService);

  constructor(private router: Router) {}

  navigateTo(route: string) {
    this.router.navigate([route]);
  }
  toggleVerificationDropdown(): void {
    this.isVerificationDropdownOpen = !this.isVerificationDropdownOpen;
  }
  deactiveVerification(){
    this.isVerificationDropdownOpen = false;
  }

}
