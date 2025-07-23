import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentsService } from 'src/app/services/payments.service';
import { CapitalizePipe } from 'src/app/core/pipes/capitalize.pipe';

@Component({
  selector: 'app-detailed-emi-info',
  standalone: true,
  imports: [CommonModule , CapitalizePipe],
  templateUrl: './detailed-emi-info.component.html',
  styleUrls: ['./detailed-emi-info.component.scss']
})
export class DetailedEmiInfoComponent {
  @Output() closeModal: EventEmitter<void> = new EventEmitter();
  @Input() disbursedId!: number;
  @Input() emiDueInfo: any[] = [];

  EmiDetailsData: any[] = [];
 title: string = 'EMI Information';
  private paymentsService = inject(PaymentsService);

  ngOnInit() {
    this.getEmiFullDetails();
  }
  getEmiFullDetails(): void {
    // this.paymentsService.getEmiInfo(this.disbursedId).subscribe({
    //   next: (response: any) => {
    //     // Ensure safe extraction of the emiDueInfo array
    //     if (response?.data?.emiDueInfo) {
    //       this.EmiDetailsData = response.data.emiDueInfo;
    //     } else {
    //       this.EmiDetailsData = [];
    //     }
    //   },
    //   error: (error) => {
    //     console.error('Error fetching EMI Info:', error);
    //     this.EmiDetailsData = [];
    //   }
    // });
    this.EmiDetailsData = this.emiDueInfo;
  }

  // formatIndianCurrency(value: any): string {
  //   if (!value) return '';
  //   // Convert number to string and format it in the Indian number system
  //   return new Intl.NumberFormat('en-IN', {
  //     minimumFractionDigits: 2,
  //     maximumFractionDigits: 2
  //   }).format(Number(value));
  // }
  
  formatIndianCurrency(value: any): string {
  if (value === null || value === undefined) return '';
  return new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(Number(value));
}

  
  close(): void {
    this.closeModal.emit();
  }

}
