import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-receivable-confirmation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './receivable-confirmation.component.html',
  styleUrls: ['./receivable-confirmation.component.scss']
})
export class ReceivableConfirmationComponent {
  @Input() message: string = 'Are you sure?';
  @Input() receivedamount :any;
  @Output() confirm = new EventEmitter<boolean>();

  onConfirm(): void {
    this.confirm.emit(true);
  }

  onCancel(): void {
    this.confirm.emit(false);
  }
    formatIndianCurrency(value: any): string {
  if (value === null || value === undefined) return '';
  return new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(Number(value));
}

}
