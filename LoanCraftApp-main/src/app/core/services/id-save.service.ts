import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class IdSaveService {

  constructor() { }

  customerId : string | null = null;

  setCustomerId(Id : string){
     this.customerId = Id;
  }

  getCustomerId():string | null{
    return this.customerId;
  }
}
