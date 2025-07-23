import { inject, Injectable } from '@angular/core';
import { ApiService } from '../core/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class RolesService {

  private apiServ = inject(ApiService);

  constructor() { }

  // get all roles
  getroles() {
    return this.apiServ.get("auth/roles/all");
  }
  getAllRoles(data: any) {
    return this.apiServ.post("auth/roles/getAllRoles", data);
  }
  getRoleById(id : any){
    return this.apiServ.get("auth/roles/getrole"+ `/${id}`); 
  }

  // findUserById(id: any){
  //   return this.api.get("api/auth/getUser"+ `/${id}`);
  // }
  //register company
  addRole(entity: any) {
    return this.apiServ.post("auth/roles/save", entity);
  }

  deleteRole(roleId: number) {
    return this.apiServ.delete("auth/roles/delete/" + roleId);
  }

  updateRole(entity: any) {
    return this.apiServ.put("auth/roles/updaterole",  entity);
  }

}
