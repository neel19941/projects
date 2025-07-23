import { inject, Injectable } from '@angular/core';
import { ApiService } from '../core/services/api.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoanSanctionService {
  private apiServ = inject(ApiService);

  constructor() { }

  getLoanSanctionByCustomerId(id: any): Observable<any> {
    return this.apiServ.findById("auth/loanSanction/getByid", id);
  }

  updateLoanSanction(data: any) {
    return this.apiServ.put("auth/customer/update", data);
  }
  postSanctionInfo(data: any) {
    return this.apiServ.post("auth/loanSanction/saveLoanSanction", data);
  }

  postGetAplications(data: any): Observable<any> {
    return this.apiServ.post("auth/loanSanction/loanSanctionSearch", data);
  }

  // dynamicData(data: any): Observable<any> {
  //   return this.apiServ.post("auth/calculateschedule", data);
  // }
  floatingBasedData(data: any): Observable<any> {
       return this.apiServ.post("auth/floatingEmi", data);
     }
 fixedBasedData(data: any): Observable<any> {
      return this.apiServ.post("auth/fixedEmi", data);
    }
  saveDisbursment(data: any): Observable<any> {
    return this.apiServ.post("auth/disbursment/saveDisbursment", data);
  }
  
  //disbursed list apis
  getDisbursedList(data: any): Observable<any> {
    return this.apiServ.post("auth/disbursment/getAllWithSearching", data);
  }
  getDisbursedFindById(id: any): Observable<any> {
    return this.apiServ.get("auth/payment/payment-statement" + `/${id}`);
  }
  getDisbursedCustomerDetails(): Observable<any> {
    return this.apiServ.get("auth/disbursment/getCustomerDetails");
  }
}
