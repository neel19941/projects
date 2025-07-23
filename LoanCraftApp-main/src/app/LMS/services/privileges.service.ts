import { inject, Injectable } from '@angular/core';
import { ApiService } from 'src/app/core/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class PrivilegesService {

  private apiServ = inject(ApiService);

  constructor() { }

 //register privilege
 addPrivilege(entity: any) {
  return this.apiServ.post("api/priviliges/savePrevileges", entity);
}

 //register privilege
 getAllPrivileges() {
  return this.apiServ.get("api/priviliges/getPrivileges");
}

addPrevilegeToRole(entity: any) {
  return this.apiServ.post("api/priviliges/addprevtorole", entity);
}

getPrivilegesById(roleId: number) {
  return this.apiServ.get("api/priviliges/getPrivilegesById/" + roleId);
}

hasPrivilege(priv: string): boolean {
  let privilagesArr: string[] = [];
  const arr = localStorage.getItem('privileges');
  if (arr && arr.length) {
     privilagesArr = arr.split(',');
  }
  return privilagesArr.includes(priv);
}

}
