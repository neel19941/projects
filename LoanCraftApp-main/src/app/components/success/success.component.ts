import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SuccessDataService } from 'src/app/core/services/success-data.service';

@Component({
  selector: 'app-success',
  standalone: true,  // Mark as standalone
  imports: [CommonModule],
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.scss']
})
export class SuccessComponent {
  applicationReferenceId: string | null = null; // Property to store the reference ID
  constructor(private rtr : Router , private successData : SuccessDataService) { }

  ngOnInit(): void {
    // Get the reference ID from the service
    // this.applicationReferenceId = this.successData.getReferenceId();
    this.applicationReferenceId = this.getReferenceId();
  }

  goBack(){
      this.rtr.navigate(['body']);
      // this.rtr.navigate(['top-navbar']);
  }
  getReferenceId(){
    return localStorage.getItem("referenceId");
  }
}
