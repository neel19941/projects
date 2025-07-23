import { Injectable } from '@angular/core';
import { delay, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PermissionsService {
  isUserLoggedIn = false;
  constructor() { }

  login(user: any) {
    // console.log("authentication " + JSON.stringify(user))
    this.isUserLoggedIn = true;
    localStorage.setItem('token', 'Bearer ' + user.token);
    localStorage.setItem('userid', user.userid);
    localStorage.setItem('username', user.fullname);
    localStorage.setItem('role', user.roles);
    localStorage.setItem('roleid', user.roleno);
    localStorage.setItem('privileges', user.rolePrivileges);
    return of(this.isUserLoggedIn).pipe(
      delay(1000),
      tap(val => {
        console.log("Is User Authentication is successful: " + val);
      })
    );
  }

}
