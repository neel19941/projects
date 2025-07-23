import { Injectable } from '@angular/core';
import { ApiService } from '../core/services/api.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  constructor(private api: ApiService, private http: HttpClient) { }
  ngOnInit() {
  }
  sendOtp(data: any): Observable<any> {
    return this.api.post("auth/otp/send-otp", data);
  }
  registerUser(data: any): Observable<any> {
    return this.api.post("auth/customer/save", data);
  }
  getAllUsers() {
    return this.api.get("auth/customer/getAll");
  }
  checkDuplicateEmail(email : any){
    return this.api.get("auth/customer/check-email/" + `${email}`);
  }
  updateCustomer(data: any) {
    return this.api.put("auth/customer/update", data);
  }
  updateCustomerr(data: any) {
    return this.api.put("auth/address/updateaddress", data);
  }
  validateOtp(otp: any): Observable<any> {
    return this.http.get<any>(this.api.apiUrl + "auth/otp/verify-otp/" + `${otp}`);
  }
  findCustomerById(id: any): Observable<any> {
    return this.api.findById("auth/customer/findById", id);
  }
  updateAddressData(id: any, data : any): Observable<any> {
    // return this.http.put<any>(this.api.apiUrl + "api/address/updateAddress/" + `${id}` , data);
    return this.api.put2("auth/address/updateAddress" , id , data);
  }
}
