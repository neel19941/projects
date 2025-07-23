import { Injectable } from '@angular/core';
import { ApiService } from '../core/services/api.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HrmService {

  constructor(private api: ApiService) {
  }
  postGetUsers(data: any): Observable<any> {
    return this.api.post("auth/users/users", data);
  }
  deleteCustomer(id: any) {
    return this.api.delete("auth/users/delete" + `/${id}`);
  }
  updateUser(data: any): Observable<any> {
    return this.api.put("auth/users/update", data);
  }
  addUser(data: any): Observable<any> {
    return this.api.post("auth/users/register", data);
  }
  findUserById(id: any){
    return this.api.get("auth/users/getUser"+ `/${id}`);
  }
}
