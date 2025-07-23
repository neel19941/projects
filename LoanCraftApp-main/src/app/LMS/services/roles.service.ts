import { inject, Injectable } from '@angular/core';
import { ApiService } from 'src/app/core/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class RolesService {

  private apiServ = inject(ApiService);

  constructor() { }

   // get all roles
   getAllRoles() {
    return this.apiServ.get("api/roles/all");
  }
  
    //register company
    addRole(entity: any) {
      return this.apiServ.post("api/roles/save", entity);
    }
    
    deleteRole(roleId: number){
      return this.apiServ.delete("api/roles/delete/"+roleId);
    }

    updateRole(entity: any){
      return this.apiServ.put("api/roles/updaterole/",+entity);
    }

    
}
