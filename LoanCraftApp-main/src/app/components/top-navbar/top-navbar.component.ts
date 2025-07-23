import { Component, EventEmitter, inject, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { map, Observable } from 'rxjs';
import { RolesService } from 'src/app/services/roles.service';
import { PrivilegesService } from 'src/app/services/privileges.service';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ApplicationsService } from 'src/app/services/applications.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgToastService } from 'ng-angular-popup';
import { ApiService } from 'src/app/core/services/api.service';
import { TitleCaseDirective } from 'src/app/core/directives/title-case.directive';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';

@Component({
  selector: 'app-top-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule , TitleCaseDirective],
  templateUrl: './top-navbar.component.html',
  styleUrls: ['./top-navbar.component.scss']
})
export class TopNavbarComponent {

  // Get card privileges from local storage and split into an array
  navigateToProfile() {
    throw new Error('Method not implemented.');
  }

  role: any;
  roleNames: string[] = [];
  protected roleManagementServ = inject(RolesService);
  menuData: any[] = [];
  menuList: any[] = [];
  protected privilegeServ = inject(PrivilegesService);
  firstname: any;
  lastname: any;
  menus: any = true;
  userform!: FormGroup
  userid = localStorage.getItem('userId')
  ngOnInit(): void {
    this.role = localStorage.getItem('role');
    // const cardPriv= localStorage.getItem('cardPrivileges')
    this.getUserNames();
    this.myRoles();
    const userId = localStorage.getItem('userId');
  if (userId) {
    const fullUrl = new URL(this.apiService.apiUrl);
    const baseUrl = `${fullUrl.protocol}//${fullUrl.hostname}`;
    this.copiedLink = `${baseUrl}/lms/#/register?id=${userId}`;
    console.log(this.copiedLink,'this.copiedLink');
    
  }
  }

  constructor(private router: Router, private auth: AuthService, private applicationser: ApplicationsService,private apiService:ApiService) {
    this.userform = new FormGroup({
      name: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      phNo: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[6-9]\d{9}$/) // exactly 10 digits
      ]),
      userId: new FormControl(this.userid)
    })
  }
  showModal: boolean = false;
  private toast = inject(CustomToastService);
  copiedLink: string = '';
copied :boolean = false
copyLink() {
  if (this.copiedLink) {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(this.copiedLink).then(() => {
        this.copied = true;
        this.toast.success({
          detail: 'Success',
          summary: 'Link copied successfully!',
          duration: 3000,
        });
      }, () => {
        this.toast.error({
          detail: 'Error',
          summary: 'Failed to copy the link.',
          duration: 3000,
        });
      });
    } else {
      // Fallback for non-secure contexts
      const textArea = document.createElement("textarea");
      textArea.value = this.copiedLink;
      // Avoid scrolling to bottom
      textArea.style.position = "fixed";
      textArea.style.top = "0";
      textArea.style.left = "0";
      textArea.style.width = "2em";
      textArea.style.height = "2em";
      textArea.style.padding = "0";
      textArea.style.border = "none";
      textArea.style.outline = "none";
      textArea.style.boxShadow = "none";
      textArea.style.background = "transparent";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        const successful = document.execCommand('copy');
        if (successful) {
          this.copied = true;
          this.toast.success({
            detail: 'Success',
            summary: 'Link copied successfully!',
            duration: 3000,
            
          });
        } else {
          throw new Error('Copy command was unsuccessful');
        }
      } catch (err) {
        this.toast.error({
          detail: 'Error',
          summary: 'Failed to copy the link.',
          duration: 3000,
        });
      }
      document.body.removeChild(textArea);
    }
  }
}

  
  
  
  submitdetails() {
    if (this.userform.invalid) {
      this.toast.error({
        detail: 'Error',
        summary: 'Please fill out all required fields.',
        duration: 3000,
      });
      this.userform.markAllAsTouched();
      return;
    }

    this.applicationser.postapplicationdetails(this.userform.value).subscribe({
      next: (res: any) => {
        console.log(res, 'submitdetails');
        this.toast.success({
          detail: 'Success',
          summary: 'Details submitted successfully!',
          duration: 3000,
        });
        this.userform.reset()
        this.close();



      },
      error: (error: any) => {
        console.error('Error submitting details:', error);
        this.toast.error({
          detail: 'Error',
          summary: 'Failed to submit details. Please try again.',
          duration: 3000,
        });
      }
    });

  }
  close(): void {
   this.showModal=false
   this.userform.reset()
   this.copied=false
  }

  myRoles() {
    this.getRoles().subscribe({
      next: (roles: string[]) => {
        this.roleNames = roles;
        const formattedRoleNames = this.roleNames.map(role => `"${role}"`).join(', ');
        this.updateMenuRoles(formattedRoleNames);
      },
      error: (err) => {
      }
    });
  }

  mymethod(arg0: string) {
    this.router.navigate([arg0]);
  }

  getRoles(): Observable<string[]> {
    return this.roleManagementServ.getroles().pipe(
      map((response: any) => response.data.map((role: any) => role.roleName))
    );
  }

  updateMenuRoles(formattedRoleNames: string) {
    const menuData = [
      {
        "test": "DASHBOARD",
        "text": "Dashboard",
        "icon": "Dashboard",
        "routerLink": "/top-navbar/employer-dashboard",
        "roles": ["Super Administrator"]
      },
      {
        "test": "CUSTOMER_DASHBOARD",
        "text": "Dashboard",
        "icon": "dashboard",
        "routerLink": "/top-navbar/dashboard",
        "roles": ["Super Administrator"]
      },
      {
        "test": "HRM",
        "text": "HRM",
        "icon": "hrm",
        "routerLink": "/top-navbar/hrm-info",
        "roles": ["Super Administrator"]
      },
      {
        "test": "CUSTOMER_INFO",
        "text": "Customer Info",
        "icon": "customer",
        "routerLink": "/top-navbar/customer-info",
        "roles": ["Super Administrator"]
      },
      {
        "test": "ROLES",
        "text": "Roles",
        "icon": "role",
        "routerLink": "/top-navbar/roles",
        "roles": ["Super Administrator"]
      },
      {
        "test": "APPLICATIONS",
        "text": "Loans",
        "icon": "applications",
        "routerLink": "/top-navbar/application-nav/applications-list",
        // "roles":["Super Administrator"]  ,
        "children": [
          {
            "test": "LOANS",
            "text": "All LOANS",
            "icon": "loan",
            "routerLink": "/top-navbar/application-nav/applications-list",
            "roles": ["Super Administrator"]
          }],
      },
      {
        "test": "RECEIVABLES",
        "text": "Receivables",
        "icon": "receivables",
        "routerLink": "/top-navbar/receivable-nav/receviables",
        "children": [
          {
            "test": "RECEIVABLE",
            "text": "Receivable",
            "icon": "receivable",
            "routerLink": "/top-navbar/receivable-nav/receviables",
            "roles": ["Super Administrator"]
          }],
      }
    ];

    // Replace static roles with dynamic roles
    menuData.forEach(item => {

      // For the item itself, assign roles if no children exist
      //   if (!item.children || !Array.isArray(item.children)) {
      //     item.roles = formattedRoleNames.split(', ').map(role => role.replace(/"/g, ''));
      //   }

      menuData.forEach(item => {
        item.roles = formattedRoleNames.split(', ').map(role => role.replace(/"/g, ''));
        // alert("parent roles dynamic==="+JSON.stringify(item.roles) +" " +item.text);
      });

      // If item has children, assign roles to children
      //  if (item.children && Array.isArray(item.children)) {
      //   let myno=0;
      //   item.children.forEach((child: any) => {
      //     item.children[myno].roles = formattedRoleNames.split(', ').map(role => role.replace(/"/g, ''));
      //     myno=myno+1;
      //   });
      // }

    });

    this.menuData = menuData;
    // console.log("Lak final data-----------"+JSON.stringify(this.menuData));
    this.getSideNavData(this.menuData);
  }

  private getSideNavData(path: any) {
    // Clear the menuList before populating it
    this.menuList = [];

    // Get card privileges from local storage and split into an array
    const cardPriv = localStorage.getItem('rolePrivilege');
    const cardPrivArray = cardPriv ? cardPriv.split(',').map(item => item.trim()) : [];

    // Recursive function to filter menus and their children based on roles and privileges
    const filterMenuItems = (menuItems: any[]) => {
      return menuItems.filter((item: any) => {
        // Check if the item satisfies the role and privileges condition
        const isRoleValid = item.roles.some((role: string) => role.toLowerCase() === this.role!.toLowerCase());
        const isPrivilegeValid = cardPrivArray.includes(item.test);

        // If the item is valid, check for children
        if (isRoleValid && isPrivilegeValid) {

          // If the item has children, recursively filter the children
          if (item.children && Array.isArray(item.children)) {
            item.children = filterMenuItems(item.children); // Apply filtering recursively on children
          }
          return true; // Include this menu item if it satisfies the conditions
        }

        // Exclude this menu item if it does not meet the role or privilege conditions
        return false;
      });
    };

    // Apply the recursive filter to the provided menu path
    this.menuList = filterMenuItems(path);

    // Assign the filtered menuList to the privileges service
    this.privilegeServ.menuList = this.menuList;

  }

  logout() {

      this.router.navigate(['/employer-login']);
      localStorage.clear();

  }

  getUserNames(): void {
    this.firstname = localStorage.getItem("firstname") || ''; // Default to empty string if null
    this.lastname = localStorage.getItem("lastname") || ''; // Default to empty string if null

  }

}
