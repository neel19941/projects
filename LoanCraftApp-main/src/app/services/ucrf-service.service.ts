import { Injectable } from '@angular/core';
import { ApiService } from '../core/services/api.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UcrfServiceService {

  constructor(private api: ApiService, private http: HttpClient) { }

  ucrfConvertFile(formData: FormData){
    return this.api.post("api/ucrf/convertUrcfFormat" , formData);
  }
  

}
