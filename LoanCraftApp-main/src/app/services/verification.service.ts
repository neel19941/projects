import { inject, Injectable } from '@angular/core';
import { ApiService } from '../core/services/api.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class VerificationService {

  private apiServ = inject(ApiService);

  constructor() { }

  // verifyDocument(id: number){
  //   return this.apiServ.get("auth/documents/verify-document"+ `/${id}`)
  // }

  verifyDocument(id: number, status: boolean) {
    const url = `auth/documents/updateDocVerified/${id}/${status}`;
    return this.apiServ.get(url);
  }

  verifyPhysicalDocument(id: number, status: boolean,loanId:any) {
    const url = `auth/documents/updatePhysicalDocVerified/${id}/${status}/${loanId}`;
    return this.apiServ.get(url);
  }
  
  getReviewedApplications(){
    return this.apiServ.get('auth/app/getReviewedAppDropDown');
  }

  getVerificationTrack(id: number) {
    return this.apiServ.get('api/verification/getVericationTrack/' + `${id}`);
  }
  getPhysicalVerifyDocuments(id: number, fileType: string) {
    return this.apiServ.get('auth/documents/getPhysicalVerificationDocuments' + `/${id}` + `/${fileType}`);
  }

  upoladMultiplePhysicalDocs(data: any): Observable<any> {
    return this.apiServ.post("auth/documents/upload-multiple", data);
  }

  getAllCustomerDocuments(id: any) {
    return this.apiServ.get('auth/documents/getAllDoc' + `/${id}`);
  }

}
