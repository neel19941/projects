import { PrivilegesService } from 'src/app/services/privileges.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgToastService } from 'ng-angular-popup';
import { RolesService } from 'src/app/services/roles.service';
import { ConfirmModalComponent } from 'src/app/core/models/confirm-modal/confirm-modal.component';
import { PlainNavigationComponent } from '../plain-navigation/plain-navigation.component';
import { AddPrivilegeComponent } from './add-privilege/add-privilege.component';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';

@Component({
  selector: 'app-privilege',
  standalone: true,
  imports: [CommonModule, AddPrivilegeComponent],
  templateUrl: './privilege.component.html',
  styleUrls: ['./privilege.component.scss']
})
export class PrivilegeComponent {

  showRoleModal = false;
  selectedRoleId: string = '';
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private privilegServ = inject(PrivilegesService);
  private destroyed$ = new Subject<void>();
  entity = new Privilege();
  id!: any;
  rolename!: string;
  roleid!: any;
  flg: boolean = false;
  user: any[] = [];
  role: any[] = [];
  home: any[] = [];
  hrm: any[] = [];
  receivables: any[] = [];
  receivable: any[] = [];
  currentDues: any[] = [];
  chequeDeposit : any[] = [];
  lowChequeRequests : any[] = [];
  customerinfo: any[] = [];
  dashboard: any[] = [];
  applications: any[] = [];
  loans: any[] = [];
  approved: any[] = [];
  sanctioned: any[] = [];
  customer_dashboard: any[] = [];
  disbursed: any[] = [];
  rejected: any[] = [];
  applicationTracking: any[] = [];
  physicalVerification: any[] = [];
  privilegResp: any[] = [];
  target: string = '';
  showAddRole = false;
  rId: any;
  private toast = inject(CustomToastService);

  constructor(private route: ActivatedRoute) {

  }

  ngOnInit(): void {

    this.rId = this.route.snapshot.paramMap.get('roleId')!;

    // this.id = this.activatedRoute.snapshot.params['id'];
    // this.entity.roleId = +this.id;

    // Retrieve the rolename from the route parameter
    this.rolename = this.route.snapshot.paramMap.get('rolename')!;

    this.id = this.route.snapshot.paramMap.get('id')!;

    //  this.id = localStorage.getItem('roleid');
    this.entity.roleId = +this.rId;

    // this.id = localStorage.getItem('roleid');
    //  this.entity.roleId = +this.id;

    this.getAll();
  }

  getAll() {
    this.privilegServ
      .getAllPrivileges()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((response: any) => {
        this.user = response.data.user;
        this.role = response.data.role;
        this.dashboard = response.data.dashboard;
        this.home = response.data.home;
        this.hrm = response.data.hrm;
        this.receivables = response.data.receivables;
        this.receivable = response.data.receivable;
        this.customerinfo = response.data.customerinfo;
        this.customer_dashboard = response.data.customer_dashboard;
        this.applications = response.data.applications;
        this.loans = response.data.loans;
        this.approved = response.data.approved;
        this.sanctioned = response.data.sanctioned;
        this.disbursed = response.data.disbursed;
        this.rejected = response.data.rejected;
        this.applicationTracking = response.data.applicationTracking;
        this.physicalVerification = response.data.physicalVerification;
        this.currentDues = response.data.currentDues;
        this.chequeDeposit = response.data.chequeDeposit;
        this.lowChequeRequests = response.data.lowChequeRequests;
        this.selecedPrivileges();
        this.mapResponseData();
      });
  }

  selecedPrivileges() {
    this.privilegServ
      .getPrivilegesById(+this.rId)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((response: any) => {

        if (this.role != null) {
          this.role.forEach((role) => {
            response.data.role.forEach((userresp: any) => {
              if (role.id === userresp.id) {
                this.entity.privilegeIds.push(userresp.id);
                role.selected = true;
                this.flg = true;
              }
            });
          });
        }

        if (this.user != null) {
          this.user.forEach((userele) => {
            response.data.user.forEach((userresp: any) => {
              if (userele.id === userresp.id) {
                this.entity.privilegeIds.push(userresp.id);
                userele.selected = true;
                this.flg = true;
              }
            });
          });
        }

        if (this.dashboard != null) {
          this.dashboard.forEach((ele) => {
            response.data.dashboard.forEach((resp: any) => {
              if (ele.id === resp.id) {
                this.entity.privilegeIds.push(resp.id);
                ele.selected = true;
                this.flg = true;
              }
            });
          });
        }

        if (this.home != null) {
          this.home.forEach((ele) => {
            response.data.home.forEach((resp: any) => {
              if (ele.id === resp.id) {
                this.entity.privilegeIds.push(resp.id);
                ele.selected = true;
                this.flg = true;
              }
            });
          });
        }

        if (this.hrm != null) {
          this.hrm.forEach((ele) => {
            response.data.hrm.forEach((resp: any) => {
              if (ele.id === resp.id) {
                this.entity.privilegeIds.push(resp.id);
                ele.selected = true;
                this.flg = true;
              }
            });
          });
        }
        if (this.receivables != null) {
          this.receivables.forEach((ele) => {
            response.data.receivables.forEach((resp: any) => {
              if (ele.id === resp.id) {
                this.entity.privilegeIds.push(resp.id);
                ele.selected = true;
                this.flg = true;
              }
            });
          });
        }
        // Handle "Receivable" (singular)
        if (this.receivable != null) {
          this.receivable.forEach((ele) => {
            response.data.receivable.forEach((resp: any) => {
              if (ele.id === resp.id) {
                this.entity.privilegeIds.push(resp.id);
                ele.selected = true;
                this.flg = true;
              }
            });
          });
        }
        if (this.currentDues != null) {
          this.currentDues.forEach((ele) => {
            response.data.currentDues.forEach((resp: any) => {
              if (ele.id === resp.id) {
                this.entity.privilegeIds.push(resp.id);
                ele.selected = true;
                this.flg = true;
              }
            });
          });
        }
if (this.chequeDeposit != null) {
  this.chequeDeposit.forEach((ele) => {
    response.data.chequeDeposit.forEach((resp: any) => {
      if (ele.id === resp.id) {
        this.entity.privilegeIds.push(resp.id);
        ele.selected = true;
        this.flg = true;
      }
    });
  });
}

if (this.lowChequeRequests != null) {
  this.lowChequeRequests.forEach((ele) => {
    response.data.lowChequeRequests.forEach((resp: any) => {
      if (ele.id === resp.id) {
        this.entity.privilegeIds.push(resp.id);
        ele.selected = true;
        this.flg = true;
      }
    });
  });
}

        if (this.customerinfo != null) {
          this.customerinfo.forEach((ele) => {
            response.data.customerinfo.forEach((resp: any) => {
              if (ele.id === resp.id) {
                this.entity.privilegeIds.push(resp.id);
                ele.selected = true;
                this.flg = true;
              }
            });
          });
        }

        if (this.customer_dashboard != null) {
          this.customer_dashboard.forEach((ele) => {
            response.data.customer_dashboard.forEach((resp: any) => {
              if (ele.id === resp.id) {
                this.entity.privilegeIds.push(resp.id);
                ele.selected = true;
                this.flg = true;
              }
            });
          });
        }

        if (this.applications != null) {
          this.applications.forEach((ele) => {
            response.data.applications.forEach((resp: any) => {
              if (ele.id === resp.id) {
                this.entity.privilegeIds.push(resp.id);
                ele.selected = true;
                this.flg = true;
              }
            });
          });
        }

        if (this.loans != null) {
          this.loans.forEach((ele) => {
            response.data.loans.forEach((resp: any) => {
              if (ele.id === resp.id) {
                this.entity.privilegeIds.push(resp.id);
                ele.selected = true;
                this.flg = true;
              }
            });
          });
        }

        if (this.approved != null) {
          this.approved.forEach((ele) => {
            response.data.approved.forEach((resp: any) => {
              if (ele.id === resp.id) {
                this.entity.privilegeIds.push(resp.id);
                ele.selected = true;
                this.flg = true;
              }
            });
          });
        }

        if (this.sanctioned != null) {
          this.sanctioned.forEach((ele) => {
            response.data.sanctioned.forEach((resp: any) => {
              if (ele.id === resp.id) {
                this.entity.privilegeIds.push(resp.id);
                ele.selected = true;
                this.flg = true;
              }
            });
          });
        }

        if (this.disbursed != null) {
          this.disbursed.forEach((ele) => {
            response.data.disbursed.forEach((resp: any) => {
              if (ele.id === resp.id) {
                this.entity.privilegeIds.push(resp.id);
                ele.selected = true;
                this.flg = true;
              }
            });
          });
        }

        if (this.rejected != null) {
          this.rejected.forEach((ele) => {
            response.data.rejected.forEach((resp: any) => {
              if (ele.id === resp.id) {
                this.entity.privilegeIds.push(resp.id);
                ele.selected = true;
                this.flg = true;
              }
            });
          });
        }
        if (this.applicationTracking != null) {
          this.applicationTracking.forEach((ele) => {
            response.data.applicationTracking.forEach((resp: any) => {
              if (ele.id === resp.id) {
                this.entity.privilegeIds.push(resp.id);
                ele.selected = true;
                this.flg = true;
              }
            });
          });
        }
        if (this.physicalVerification != null) {
          this.physicalVerification.forEach((ele) => {
            response.data.physicalVerification.forEach((resp: any) => {
              if (ele.id === resp.id) {
                this.entity.privilegeIds.push(resp.id);
                ele.selected = true;
                this.flg = true;
              }
            });
          });
        }
      });
  }
  private mapResponseData() {

    this.privilegResp.push(
      {
        title: 'Dashboard',
        privileges: this.dashboard,
        isSelected: this.dashboard
          ? this.dashboard.every((priv: any) => priv.selected === true)
          : false,
      },
      //  {
      //   title: 'Customer Dashboard',
      //   privileges: this.customer_dashboard,
      //   isSelected: this.customer_dashboard
      //     ? this.customer_dashboard.every((priv: any) => priv.selected === true)
      //     : false,
      // },
      {
        title: 'Hrm',
        privileges: this.hrm,
        isSelected: this.hrm
          ? this.hrm.every((priv: any) => priv.selected === true)
          : false,
      },
      {
        title: 'Customer Info',
        privileges: this.customerinfo,
        isSelected: this.customerinfo
          ? this.customerinfo.every((priv: any) => priv.selected === true)
          : false,
      },
      {
        title: 'Role',
        privileges: this.role,
        isSelected: this.role
          ? this.role.every((priv: any) => priv.selected === true)
          : false,
      },
      {
        title: 'Applications',
        privileges: this.applications,
        isSelected: this.applications
          ? this.applications.every((priv: any) => priv.selected === true)
          : false,
      },
      {
        title: 'Loans',
        privileges: this.loans,
        isSelected: this.loans
          ? this.loans.every((priv: any) => priv.selected === true)
          : false,
      },

      {
        title: 'Approved',
        privileges: this.approved,
        isSelected: this.approved
          ? this.approved.every((priv: any) => priv.selected === true)
          : false,
      },
      {
        title: 'Sanctioned',
        privileges: this.sanctioned,
        isSelected: this.sanctioned
          ? this.sanctioned.every((priv: any) => priv.selected === true)
          : false,
      },
      {
        title: 'Disbursed',
        privileges: this.disbursed,
        isSelected: this.disbursed
          ? this.disbursed.every((priv: any) => priv.selected === true)
          : false,
      },
      {
        title: 'Rejected',
        privileges: this.rejected,
        isSelected: this.rejected
          ? this.rejected.every((priv: any) => priv.selected === true)
          : false,
      },
      {
        title: 'applicationTracking',
        privileges: this.applicationTracking,
        isSelected: this.applicationTracking
          ? this.applicationTracking.every((priv: any) => priv.selected === true)
          : false,
      },
      {
        title: 'physicalVerification',
        privileges: this.physicalVerification,
        isSelected: this.physicalVerification
          ? this.physicalVerification.every((priv: any) => priv.selected === true)
          : false,
      },
      {
        title: 'Receivables',
        privileges: this.receivables,
        isSelected: this.receivables
          ? this.receivables.every((priv: any) => priv.selected === true)
          : false,
      },
      {
        title: 'Receivable',
        privileges: this.receivable,
        isSelected: this.receivable
          ? this.receivable.every((priv: any) => priv.selected === true)
          : false,
      },
      {
        title: 'Current Dues',
        privileges: this.currentDues,
        isSelected: this.currentDues
          ? this.currentDues.every((priv: any) => priv.selected === true)
          : false,
      },
            {
        title: 'Cheque Deposits',
        privileges: this.chequeDeposit,
        isSelected: this.chequeDeposit
          ? this.chequeDeposit.every((priv: any) => priv.selected === true)
          : false,
      },
            {
        title: 'Low Cheque Deposit Requests',
        privileges: this.lowChequeRequests,
        isSelected: this.lowChequeRequests
          ? this.lowChequeRequests.every((priv: any) => priv.selected === true)
          : false,
      }
    );
  }

  addnewrole() {
    this.router.navigate(['/add-privileges']);
  }

  selectInidividualAccess(
    event: Event,
    privileges: any,
    privId: number,
    cardId: number,
    card: any,
    priv: any,
    privilegResp: any
  ) {
    const isChecked = (event.target as HTMLInputElement).checked;

    if (priv.cardType === 'many' && isChecked) {
      let myval = 0;
      privilegResp?.forEach((care: any) => {
        care.privileges?.forEach((ar: any) => {
          if (priv.name.toLowerCase() === ar.name.toLowerCase() && cardId != myval) {
            care.privileges?.forEach((ele: any) => {
              ele.selected = true;
              this.entity.privilegeIds.push(ele.id);
              care.isSelected = true;
            });
            this.entity.privilegeIds = [...new Set(this.entity.privilegeIds)];
          }
        });
        myval++;
      });
    } else if (priv.cardType.toLowerCase() === 'many'.toLowerCase() && !isChecked) {
      let myval = 0;
      privilegResp?.forEach((care: any) => {
        care.privileges?.forEach((ar: any) => {
          if (priv.name.toLowerCase() === ar.name.toLowerCase() && cardId != myval) {
            care.privileges?.forEach((ele: any) => {
              ele.selected = false;
              care.isSelected = false;
              this.entity.privilegeIds = this.entity.privilegeIds.filter(
                (id) => id !== ele.id
              );
            });
            this.entity.privilegeIds = [...new Set(this.entity.privilegeIds)];
          }
        });
        myval++;
      });
    }

    if (isChecked && privId === 0) {
      card.privileges?.forEach((ele: any) => {
        ele.selected = true;
        this.entity.privilegeIds.push(ele.id);
        card.isSelected = true;
      });
      this.entity.privilegeIds = [...new Set(this.entity.privilegeIds)];
    } else if (!isChecked && privId === 0) {
      card.privileges?.forEach((ele: any) => {
        ele.selected = false;
        card.isSelected = false;
        this.entity.privilegeIds = this.entity.privilegeIds.filter(
          (id) => id !== ele.id
        );
      });
    } else if (isChecked) {
      privileges[privId].selected = true;
      this.entity.privilegeIds.push(privileges[privId].id);
      this.entity.privilegeIds = [...new Set(this.entity.privilegeIds)];
    } else {
      privileges[privId].selected = false;
      this.entity.privilegeIds = this.entity.privilegeIds.filter(
        (id) => id !== privileges[privId].id
      );
    }

    if (isChecked && privId != 0) {
      privileges[0].selected = isChecked;
      privileges[privId].selected = isChecked;
      this.entity.privilegeIds.push(privileges[privId].id);
      this.entity.privilegeIds.push(privileges[0].id);

      this.entity.privilegeIds = [...new Set(this.entity.privilegeIds)];
    }


  }

  onCancel() {
    //  this.router.navigate(['/body/roles']);
    this.router.navigate(['/top-navbar/roles']);
  }

  onSearch($event: KeyboardEvent) {
    throw new Error('Method not implemented.');
  }

  closeRoleModal() {
    this.showRoleModal = false;
    // this.getRoles();
  }

  savePrivileges() {
    //console.log("Save Privileges Object", this.entity)

    this.privilegServ.addPrevilegeToRole(this.entity).subscribe({
      next: (response: any) => {
        if (response.status === "Success") {
          this.toast.success({
            detail: 'Success',
            summary: 'Privilege saved successfully.',
            duration: 3000
          });
          // this.close();
          // this.router.navigate(['/body/roles']);
          this.router.navigate(['/top-navbar/roles']);
        }   //if end
        else {
          this.toast.error({
            detail: 'Error',
            summary: response.message,
            duration: 3000
          });
          // this.close();
        }  //else end
      },
      error: (error) => {
        this.toast.error({
          detail: 'Error',
          summary: 'Failed to save Privilege.',
          duration: 3000
        });
      }
    });

  }

  ngOnDestroy(): void {
    this.destroyed$.next(undefined);
    this.destroyed$.complete();
  }

  openAddRole(target: string): void {
    this.target = target;
    this.showAddRole = true;
  }

  closeAddRole(): void {
    this.showAddRole = false;
  }

}

export class Privilege {
  roleId!: number;
  privilegeIds: any[] = [];
}
