import { inject, Injectable } from '@angular/core';
import { ApiService } from '../core/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class PrivilegesService {
  menuList: any[] = [];
  constructor() { }

private apiServ = inject(ApiService);

 //register privilege
 addPrivilege(entity: any) {
  return this.apiServ.post("auth/priviliges/savePrevileges", entity);
}

 //register privilege
 getAllPrivileges() {
  return this.apiServ.get("auth/priviliges/getPrivileges");
}

addPrevilegeToRole(entity: any) {
  return this.apiServ.post("auth/priviliges/addprevtorole", entity);
}

getPrivilegesById(roleId: number) {
  return this.apiServ.get("auth/priviliges/getPrivilegesById/" + roleId);
}

hasPrivilege(priv: string): boolean {
  let privilagesArr: string[] = [];
  const arr = localStorage.getItem('rolePrivilege');
  if (arr && arr.length) {
     privilagesArr = arr.split(',');
  }
  return privilagesArr.includes(priv);
}

}
