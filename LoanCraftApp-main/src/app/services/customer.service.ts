import { Injectable } from '@angular/core';
import { ApiService } from '../core/services/api.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  constructor(private api: ApiService) {

  }
  postGetCustomers(data: any): Observable<any> {
    return this.api.post("auth/customer/getAll", data);
  }
  deleteCustomer(id: any) {
    return this.api.delete("auth/customer/deleteById" + `/${id}`);
  }
  getAllCustomerApplications(id: any) {
    return this.api.get("auth/customer/getApplicationsForLoggedInCustomer" + `/${id}`);
  }
  requestForMissingDocs(id: any, status: any) {
    return this.api.get("auth/app/updateIsRequestedFileUpload" + `/${id}` + `/${status}`);
  }
  acceptRequestForUpload(id: any, status: any) {
    return this.api.get("auth/app/updateIsFileUpload" + `/${id}` + `/${status}`);
  }
}
