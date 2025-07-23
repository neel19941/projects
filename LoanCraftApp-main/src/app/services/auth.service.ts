import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../core/services/api.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private rtr : Router , private api: ApiService, private http: HttpClient) { }

  // storeToken(tokenValue: string) {
  //   localStorage.setItem('token', tokenValue);
  // }

  storeToken(tokenValue: string, role: string) {
    localStorage.setItem('token', tokenValue);
    localStorage.setItem('role', role); // Store role
  }

  getToken()  {
    return localStorage.getItem('token');
  }

  getRole(): string | null {
    return localStorage.getItem('role'); // Retrieve role
  }

  customerLogin(data: any) : Observable<any>{
    return this.api.post("api/auth/login", data);
  }

  isLoggedIn(): boolean{
    return !!this.getToken();
  }

  isLogOut(){
    localStorage.clear();
    localStorage.removeItem('token');
    this.rtr.navigate(['/customer-login']);
  }
}