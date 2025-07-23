import { inject, Injectable } from '@angular/core';
import { ApiService } from '../core/services/api.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApplicationsService {

  private apiServ = inject(ApiService);

  constructor(private http: HttpClient) { }

  getAllApplications(data: any) {
    return this.apiServ.post("auth/app/getAllApplication", data);
  }
  getApprovedApplications(data: any) {
    return this.apiServ.post("auth/app/getAllApporved", data);
  }
  getFindById(id: number) {
    return this.apiServ.get("auth/app/getById" + `/${id}`);
  }

  reviewStatus(data: any) {
    return this.apiServ.put("auth/app/updatestatus", data);
  }
  postapplicationdetails(payload: any) {
    return this.apiServ.post("auth/invitations/invite", payload)
  }
  getLoanDocuments(id: number){
    return this.apiServ.get("auth/documents/getLoanAppDocs"+ `/${id}`)
  }
  viewOrDownloadFile(id: number): Observable<Blob> {
    const url = `${this.apiServ.apiUrl}auth/documents/download-file/${id}`;
    return this.http.get(url, {
      responseType: 'blob'
    });
  }
  


}
