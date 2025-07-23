import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { AuthService } from 'src/app/services/auth.service';
import { PrivilegesService } from 'src/app/services/privileges.service';
import { CustomToastService } from '../services/custom-toast.service';

// export const authGuard: CanActivateFn = (route, state) => {

//   const auth = inject(AuthService);
//   const router = inject(Router);
//   const toast = inject(NgToastService);

//   const token = auth.getToken();
//   const role = auth.getRole(); // Get user role from localStorage

//   if (!token) {
//     toast.warning({
//       detail: 'Warning',
//       summary: 'Please login first!',
//       duration: 3000,
//     });
//     router.navigate(['/customer-login']);
//     return false;
//   }

//   // Get the expected role from route data (see Step 3 below)
//   const expectedRole = route.data?.['role'];

//   // If expectedRole is defined, restrict access
//   if (expectedRole && expectedRole !== role) {
//     toast.error({
//       detail: 'Access Denied',
//       summary: 'You do not have permission to access this page!',
//       duration: 3000,
//     });
//     router.navigate(['/dashboard']); // Redirect to dashboard or another safe route
//     return false;
//   }

//   return true;
// };


export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const toast = inject(CustomToastService);
  const privilegeServ = inject(PrivilegesService); // Inject your privilege service

  const token = auth.getToken();
  const userRole = auth.getRole(); // Assuming this returns the role from localStorage

  if (!token) {
    toast.warning({
      detail: 'Warning',
      summary: 'Please login first!',
      duration: 3000,
    });
    router.navigate(['/customer-login']);
    return false;
  }

  // Optional: Check role if defined in route
  // const expectedRole = route.data?.['role'];
  // if (expectedRole && expectedRole !== userRole) {
  //   toast.error({
  //     detail: 'Access Denied',
  //     summary: 'You do not have permission to access this page!',
  //     duration: 3000,
  //   });
  //   router.navigate(['/dashboard']);
  //   return false;
  // }

  // ✅ Check privilege if defined
  const requiredPrivilege = route.data?.['privilege'];
  if (requiredPrivilege && !privilegeServ.hasPrivilege(requiredPrivilege)) {
    toast.error({
      detail: 'Access Denied',
      summary: 'You do not have permission to access this page!',
      duration: 3000,
    });
    router.navigate(['/dashboard']);
    return false;
  }

  return true;
};





// export class AuthGuard implements CanActivate {
//   constructor(private auth: AuthService, private router: Router) {}

//   canActivate(): boolean {
//     if (this.auth.isLoggedIn()) {
//       return true;
//     } else {
//       this.router.navigate(['/login']); // Redirect to login if not authenticated
//       return false;
//     }
//   }
// }