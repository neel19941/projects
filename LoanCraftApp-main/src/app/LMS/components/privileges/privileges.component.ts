import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PrivilegesService } from '../../services/privileges.service';
import { Subject, takeUntil } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-privileges',
  templateUrl: './privileges.component.html',
  styleUrls: ['./privileges.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
})
export class PrivilegesComponent implements OnInit, OnDestroy{

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
  dashboard: any[] = [];
  privilegResp: any[] = [];

constructor(private route: ActivatedRoute){

}

  ngOnInit(): void {

    // this.id = this.activatedRoute.snapshot.params['id'];
    // this.entity.roleId = +this.id;

 // Retrieve the rolename from the route parameter
 this.rolename = this.route.snapshot.paramMap.get('rolename')!;

 this.id = this.route.snapshot.paramMap.get('id')!;

//  this.id = localStorage.getItem('roleid');
     this.entity.roleId = +this.id;

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
        this.selecedPrivileges();
        this.mapResponseData();
      });
  }
 

  selecedPrivileges() {
    this.privilegServ
      .getPrivilegesById(this.entity.roleId)
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
      {
        title: 'User',
        privileges: this.user,
        isSelected: this.user
          ? this.user.every((priv: any) => priv.selected === true)
          : false,
      },
      {
        title: 'Role',
        privileges: this.role,
        isSelected: this.role
          ? this.role.every((priv: any) => priv.selected === true)
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
  }

  onCancel() {
    this.router.navigate(['/roles']);
  }

  savePrivileges() {
    //console.log("Save Privileges Object", this.entity)
    this.privilegServ
      .addPrevilegeToRole(this.entity)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(
        (result) => {
          console.log("Previleges added successfully!");
          this.router.navigate(['/roles']);
        },
        (error: any) => {
          if (error.status == 401) {
            console.log("Previleges addition is failed!");
          } else {
            console.log("Previleges addition is failed!");
          }
        }
      );
  }

  ngOnDestroy(): void {
    this.destroyed$.next(undefined);
    this.destroyed$.complete();
  }
}

export class Privilege {
  roleId!: number;
  privilegeIds: any[] = [];
}
