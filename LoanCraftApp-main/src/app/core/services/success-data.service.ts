import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SuccessDataService {

  constructor() { }

  private referenceId: string | null = null;

  setReferenceId(id: string) {
    this.referenceId = id;
  }

  getReferenceId(): string | null {
    return this.referenceId;
  }

}
