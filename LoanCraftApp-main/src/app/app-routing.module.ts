import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { LoanComponentComponent } from './components/loan-component/loan-component.component';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SuccessComponent } from './components/success/success.component';
import { RegisterComponent } from './components/register/register.component';
import { TopnavComponent } from './components/topnav/topnav.component';
import { ApplicationFormComponent } from './components/application-form/application-form.component';

// import { RolesComponent } from './LMS/components/roles/roles.component';
import { AddrolesComponent } from './LMS/components/roles/addroles/addroles.component';
// import { Privilege, PrivilegesComponent } from './LMS/components/privileges/privileges.component';
import { AddprivilegeComponent } from './LMS/components/privileges/addprivilege/addprivilege.component';

import { BodyComponent } from './components/body/body.component';
import { ProfilePageComponent } from './components/profile-page/profile-page.component';
import { authGuard } from './core/guards/auth.guard';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { CustomerInfoComponent } from './components/customer-info/customer-info.component';
import { EmployerLoginComponent } from './components/employer-login/employer-login.component';
import { UCRFFileUploadComponent } from './components/ucrf-file-upload/ucrf-file-upload.component';
import { HrmInfoComponent } from './components/hrm-info/hrm-info.component';
import { RolesComponent } from './components/roles/roles.component';
import { CustomerLoginComponent } from './components/customer-login/customer-login.component';
import { EmployerDashboardComponent } from './components/employer-dashboard/employer-dashboard.component';

import { ApplicationsListComponent } from './components/applications-list/applications-list.component';
import { ApprovedApplicationsComponent } from './components/approved-applications/approved-applications.component';
import { ApplicationsNavComponent } from './components/applications-nav/applications-nav.component';
import { SanctionedListsComponent } from './components/sanctioned-lists/sanctioned-lists.component';
import { PrivilegeComponent } from './components/privilege/privilege.component';
import { AddPrivilegeComponent } from './components/privilege/add-privilege/add-privilege.component';
import { TopNavbarComponent } from './components/top-navbar/top-navbar.component';
import { DisbursedApplicationsComponent } from './components/disbursed-applications/disbursed-applications.component';
import { RejectedApplicationsComponent } from './components/rejected-applications/rejected-applications.component';
import { PaymentApplicationsComponent } from './components/payment-applications/payment-applications.component';
import { ReceivablesNavComponent } from './components/receivables-nav/receivables-nav.component';
import { ReceivablesComponent } from './components/receivables-nav/receivables/receivables.component';
import { CurrentMonthDuesComponent } from './components/receivables-nav/current-month-dues/current-month-dues.component';
import { VerificationComponent } from './components/verification/verification.component';
import { PhysicalVerifcationComponent } from './components/physical-verifcation/physical-verifcation.component';
import { PhysicalDocsVerifyComponent } from './components/verification/physical-docs-verify/physical-docs-verify.component';
import { CustomerApplicationsComponent } from './components/customer-applications/customer-applications.component';
import { CheckBounceListComponent } from './components/receivables-nav/receivables/check-bounce-list/check-bounce-list.component';
import { LowChequeDepositRequestComponent } from './components/receivables-nav/receivables/low-cheque-deposit-request/low-cheque-deposit-request.component';
import { MemberReportComponent } from './components/receivables-nav/receivables/member-report/member-report.component';

// const routes: Routes = [
//   { path: '', redirectTo: 'employer-login', pathMatch: 'full' },
//   { path: 'sidenav', component: SidenavComponent },
//   { path: 'register', component: RegisterComponent },
//   { path: 'topnav', component: TopnavComponent },
//   { path: 'top-navbar', component: TopNavbarComponent ,
//   // { path: 'body', component: BodyComponent,
//     children: [
//       { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
//       // { path: 'dashboard', component: DashboardComponent },
//       // { path: 'application', component: ApplicationFormComponent },
//       // { path: 'profile', component: ProfilePageComponent },
//       { path: 'success', component: SuccessComponent },
//       { path: 'customer-info', component: CustomerInfoComponent },
//       { path: 'hrm-info', component: HrmInfoComponent },
//       {path : 'roles' , component : RolesComponent}, 
//       {path : 'employer-dashboard' , component : EmployerDashboardComponent},

//       // {path : 'applications-list' , component : ApplicationsListComponent},
//       // {path : 'approved-lists' , component : ApprovedApplicationsComponent},
//       // {path : 'sanctioned-lists' , component : SanctionedListsComponent}
//       {path : 'payments', component : PaymentApplicationsComponent},
//       {path : 'application-nav' , component : ApplicationsNavComponent,
//         children : [
//           { path: '', redirectTo: 'applications-list', pathMatch: 'full' },
//           {path : 'applications-list' , component : ApplicationsListComponent},
//           {path : 'approved-lists' , component : ApprovedApplicationsComponent},
//           {path : 'sanctioned-lists' , component : SanctionedListsComponent},
//           {path : 'disbursed-list' , component : DisbursedApplicationsComponent},
//           {path : 'rejected-list' , component : RejectedApplicationsComponent}
//         ]
//       },
//       { path: 'privileges', component: PrivilegeComponent },
//       // { path: 'privileges/:roleId', component: PrivilegeComponent },
//       { path: 'privileges/:roleId', component: PrivilegeComponent },

//     //  { path: 'privileges/:id/:rolename', component: PrivilegeListComponent },
//       { path: 'add-privileges', component: AddPrivilegeComponent },
//     ]
//   },
//   { path: 'body', component: BodyComponent,
//       children: [
//         { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
//         { path: 'dashboard', component: DashboardComponent },
//         { path: 'application', component: ApplicationFormComponent },
//         { path: 'profile', component: ProfilePageComponent },
//         { path: 'success', component: SuccessComponent },
//       ]
//     },
//   { path: 'ucrf-upload', component: UCRFFileUploadComponent },
//   { path: 'login', component: LoginComponent },
//   { path: 'employer-login', component: EmployerLoginComponent },
//   { path: 'loan-application', component: LoanComponentComponent },
//   { path: 'success', component: SuccessComponent},
//   {path : 'customer-login' , component : CustomerLoginComponent},
//   // { path: 'roles', component: RolesComponent },

//   { path: 'add-roles', component: AddrolesComponent },
//   // { path: 'privileges/:id/:rolename', component: PrivilegesComponent },
// ];

const routes: Routes = [

  { path: '', redirectTo: 'employer-login', pathMatch: 'full' },
  { path: 'register', component: RegisterComponent },
  { path: 'employer-login', component: EmployerLoginComponent },
  { path: 'customer-login', component: CustomerLoginComponent },
  { path: 'topnav', component: TopnavComponent },

  {
    path: 'top-navbar', component: TopNavbarComponent,
    children: [
      { path: '', redirectTo: 'employer-dashboard', pathMatch: 'full' },

      { path: 'customer-info', component: CustomerInfoComponent,canActivate: [authGuard], data: { privilege: 'CUSTOMER_INFO' } },

      { path: 'hrm-info', component: HrmInfoComponent, canActivate: [authGuard], data: { privilege: 'HRM' } },

      { path: 'roles', component: RolesComponent, canActivate: [authGuard] , data: { privilege: 'ROLES' }},

      { path: 'employer-dashboard', component: EmployerDashboardComponent, canActivate: [authGuard] , data: { privilege: 'DASHBOARD' }},

      {
        path: 'application-nav', component: ApplicationsNavComponent,
        children: [
          { path: '', redirectTo: 'applications-list', pathMatch: 'full' },
          { path: 'applications-list', component: ApplicationsListComponent, canActivate: [authGuard] , data: { privilege: 'LOANS' }},
          { path: 'application-tracking', component: VerificationComponent, canActivate: [authGuard] , data : {privilege : 'APPLICATION_TRACKING'}},
          // { path: 'physical-verification', component: PhysicalVerifcationComponent, canActivate: [authGuard]},
          { path: 'physical-docs-verify', component: PhysicalDocsVerifyComponent, canActivate: [authGuard] ,  data : {privilege : 'PHYSICAL_VERIFICATION'}},
          
          { path: 'approved-lists', component: ApprovedApplicationsComponent, canActivate: [authGuard] , data: { privilege: 'APPROVED' }},
          { path: 'sanctioned-lists', component: SanctionedListsComponent, canActivate: [authGuard], data: { privilege: 'SANCTIONED' } },
          { path: 'disbursed-list', component: DisbursedApplicationsComponent, canActivate: [authGuard] , data: { privilege: 'DISBURSED' } },
          { path: 'rejected-list', component: RejectedApplicationsComponent, canActivate: [authGuard] , data: { privilege: 'REJECTED' }}
        ]
      },

      {
        path: 'receivable-nav', component: ReceivablesNavComponent,
        children: [
          { path: '', redirectTo: 'receviables', pathMatch: 'full' },
          { path: 'receviables', component: ReceivablesComponent, canActivate: [authGuard] , data: { privilege: 'RECEIVABLE' } },
          { path: 'current-dues', component: CurrentMonthDuesComponent, canActivate: [authGuard] , data: { privilege: 'CURRENTDUES' } },
          { path : 'check-bounce-list' , component : CheckBounceListComponent , canActivate: [authGuard] , data: { privilege: 'CURRENTDUES' }},
          { path : 'low-cheque-deposit' , component : LowChequeDepositRequestComponent , canActivate: [authGuard] , data: { privilege: 'CURRENTDUES' }},
          { path : 'member-reports' ,  component : MemberReportComponent ,  canActivate : [authGuard] , data : {privilege : 'CURRENTDUES'}}
          
        ]
      },
      
      { path: 'privileges', component: PrivilegeComponent, canActivate: [authGuard] ,  data: { privilege: 'PRIVILEGE' } },
      { path: 'privileges/:roleId', component: PrivilegeComponent, canActivate: [authGuard] ,  data: { privilege: 'PRIVILEGE' } },
      { path: 'add-privileges', component: AddPrivilegeComponent, canActivate: [authGuard] },
    ]
  },

  {
    path: 'body', component: BodyComponent, canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
      { path: 'application', component: ApplicationFormComponent, canActivate: [authGuard] },
      { path: 'profile', component: ProfilePageComponent, canActivate: [authGuard] },
      { path: 'success', component: SuccessComponent, canActivate: [authGuard] },
      { path: 'customer-applications', component:  CustomerApplicationsComponent, canActivate: [authGuard] },
    ]
  },
  { path: 'ucrf-upload', component: UCRFFileUploadComponent },
  { path: 'success', component: SuccessComponent },

  // { path: 'add-roles', component: AddrolesComponent, canActivate: [authGuard]  },
  // { path: 'payments', component: PaymentApplicationsComponent, canActivate: [authGuard] },
  // { path: 'sidenav', component: SidenavComponent},
  // { path: 'loan-application', component: LoanComponentComponent},
  //  { path: 'login', component: LoginComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
  providers: [
    {
      provide: LocationStrategy, useClass: HashLocationStrategy,
    }
  ]
})

export class AppRoutingModule { }

// path: 'top-navbar', component: TopNavbarComponent, canActivate: [authGuard], data: { role: 'EMPLOYEE' },
// path: 'body', component: BodyComponent, canActivate: [authGuard], data: { role: 'customer' },