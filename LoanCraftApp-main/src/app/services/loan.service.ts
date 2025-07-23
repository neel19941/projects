import { Injectable } from '@angular/core';
import { ApiService } from '../core/services/api.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StateApiResponse} from '../components/address-info/state-model';

@Injectable({
  providedIn: 'root'
})
export class LoanService {

  constructor(private api: ApiService, private http: HttpClient) { }

  postUser(data: any): Observable<any> {
    return this.api.post("auth/app/save", data);
  }

  // postWithParams(url: string, body: any, params: HttpParams): Observable<any> {
  //   return this.http.post(`${this.api.apiUrl}${url}`, body, { params });
  // }
  
  // postWithParams(url: string, body: any,options: any = {}): Observable<any> {
  //   return this.http.post(`${this.api.apiUrl}${url}`, body, options);
  // }
  postWithParams(url: string, body: any): Observable<any> {
    return this.http.post(`${this.api.apiUrl}${url}`, body);
  }
  getUser() {
    return this.api.get("api/app/get");
  }

 checkDuplicateAadhaar(aadhaar: string): Observable<any> {
    return this.http.get<any>(this.api.apiUrl+"app/duplicateCheck"+`${aadhaar}`);
  }

  getStateCode(): Observable<StateApiResponse> {
    return this.http.get<StateApiResponse>(this.api.apiUrl+"auth/statecode/All");
  }

  checkEligibility(id : any): Observable<any>{
     return this.http.get<any>(this.api.apiUrl+"auth/customer/checkEligibility/"+`${id}`);
  }
}