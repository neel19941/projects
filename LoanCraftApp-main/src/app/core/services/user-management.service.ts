import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Users } from '../models/users';
import { map, Observable } from 'rxjs';
import { ApiService } from './api.service';


@Injectable({
  providedIn: 'root'
})
export class UserManagementService {

  private apiServ = inject(ApiService);

  constructor(private http:HttpClient) { }

   // login controller signin method
   login(user: Partial<Users>): Observable<any> { 
    return this.http.post<any>(this.apiServ.apiUrl + 'api/auth/generateToken', user,
      { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) }).pipe(map((resp) => {
        return resp;
      }));
  }


}
