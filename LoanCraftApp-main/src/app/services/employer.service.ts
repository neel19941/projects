import { Injectable } from '@angular/core';
import { ApiService } from '../core/services/api.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmployerService {

  constructor(private api: ApiService) { }
  registerEmployer(data : any) :Observable<any>{
      return this.api.post("api/auth/register" , data);
  }
  
  postEmployer(data: any): Observable<any> {
    return this.api.post("api/auth/generateToken", data);
  }

}
