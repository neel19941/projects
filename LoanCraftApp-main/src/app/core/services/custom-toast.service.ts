import { Injectable } from '@angular/core';
import { IToast, NgToastService } from 'ng-angular-popup';

@Injectable({
  providedIn: 'root'
})
export class CustomToastService {
  constructor(private toast: NgToastService) {}

  success(message: IToast): void {
    this.toast.success(this.toTitleCaseMessage(message));
  }

  error(message: IToast): void {
    this.toast.error(this.toTitleCaseMessage(message));
  }

  info(message: IToast): void {
    this.toast.info(this.toTitleCaseMessage(message));
  }

  warning(message: IToast): void {
    this.toast.warning(this.toTitleCaseMessage(message));
  }

  private toTitleCaseMessage(message: IToast): IToast {
    return {
      ...message,
      detail: this.toTitleCase(message.detail ?? ''),
      summary: this.toTitleCase(message.summary ?? '')
    };
  }
  
  private toTitleCase(str: string): string {
    return str
      ?.toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
}
