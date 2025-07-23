import { Injectable } from '@angular/core';
import { ApiService } from '../core/services/api.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class PaymentsService {

  constructor(private api: ApiService, private http: HttpClient) { }

  getPaymentAplications(data: any): Observable<any> {
    return this.api.post("api/payment/getAllPaymentList", data);
  }

  saveThePaymentData(data: any): Observable<any> {
    return this.api.post("api/payment/savePayment", data);
  }

  findPaymentById(id: any) {
    return this.api.get("api/payment/getPayment" + `/${id}`);
  }

  updatePaymentmethod(data: any) {
    return this.api.put("api/payment/updatePayment", data);
  }

  getPaymentStatements(id: any) {
    return this.api.get("auth/payment/payment-statement" + `/${id}`);
  }

  getCurrentDues(data: any): Observable<any> {
    return this.api.post("auth/payment/getMonthlyDueList", data);
  }

  getEmiInfo(id: any) {
    return this.api.get("receipt/getEmiInfo" + `/${id}`);
  }

  getEmiInfoByDate(id: any, date: any) {
    return this.api.get("receipt/getEmiInfoByReceiptDate" + `/${id}` + `/${date}`);
  }

  getEmiMonths(id: any) {
    return this.api.get("auth/checkDeposit/getRepaymentMonthYear" + `/${id}`);
  }

  postEmiData(data: any): Observable<any> {
    return this.api.post("receipt/payLoan", data);
  }

  postChequeDeposit(data: any): Observable<any> {
    return this.api.post("auth/checkDeposit/saveCheck", data);
  }

  updateChequeDeposit(data: any): Observable<any> {
    return this.api.put("auth/checkDeposit/updateCheck", data);
  }
  getRoleById(id: any) {
    return this.api.get("auth/checkDeposit/getById" + `/${id}`);
  }
  updateChequeDepositStatus(id: any, value: any , reason : any , userId : any) {
    return this.api.get("auth/checkDeposit/UpdateStatus" + `/${id}` + `/${value}` + `/${reason}` + `/${userId}`);
  }
  getAllCheckBounceList(data: any): Observable<any> {
    return this.api.post("auth/checkDeposit/getAll", data);
  }

  saveLowChequeApproval(data : any): Observable<any> {
    return this.api.post("auth/LowCheckApproval/save" , data);
  }
  getAllLowChequeDepositRequests(data : any) : Observable<any>{
     return this.api.post("auth/LowCheckApproval/getLowCheckDepositDetails" , data);
  }

  lowChequeRequestApproval(id: any, value: any , reason : any){
    return this.api.get("auth/LowCheckApproval/updateIsApproved"  + `/${id}` + `/${value}` + `/${reason}`);
  }

  //member report APIs
  getTransactionsMemberReports(id : any){
    return this.api.get("auth/payment/getAllRepaymentTransactions" + `/${id}`);
  }
  
}
