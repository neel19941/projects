import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VerificationService } from 'src/app/services/verification.service';
import { NgToastService } from 'ng-angular-popup';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';

@Component({
  selector: 'app-physical-verifcation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './physical-verifcation.component.html',
  styleUrls: ['./physical-verifcation.component.scss']
})
export class PhysicalVerifcationComponent {
  @Output() closeModal: EventEmitter<void> = new EventEmitter();
  @Input() LoanId! : number;
  private verifyServ = inject(VerificationService);
  private toast = inject(CustomToastService);
  selectedFiles: File[] = [];
  selectedFileNames: string[] = [];

  onFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFiles = Array.from(input.files);
      this.selectedFileNames = this.selectedFiles.map(file => file.name);
    }
  }

  // uploadFiles(): void {
  //   if (this.selectedFiles.length === 0) return;
  //   const formData = new FormData();
  //   this.selectedFiles.forEach(file => {
  //     formData.append('files', file); // server must handle 'files' as array
  //   });
  //   formData.append('loanId' , this.LoanId);
  //  this.verifyServ.upoladMultiplePhysicalDocs(formData).subscribe({
  //   next : (response : any)=>{
  //      if(response.status === "success"){
              
  //      }else{

  //      }
  //   },error : (err)=>{

  //   }
  //  });
  //   // Replace this with actual upload call
  //   console.log('Uploading files:', this.selectedFileNames);
  //   alert(`Files uploaded: ${this.selectedFileNames.join(', ')}`);

  //   // Reset
  //   this.selectedFiles = [];
  //   this.selectedFileNames = [];
  //   this.close();
  // }
  uploadFiles(): void {
    if (this.selectedFiles.length === 0) {
      this.toast.warning({ 
        detail: 'Warning', 
        summary: 'Please select at least one file to upload.', 
        duration: 3000 
      });
      return;
    }
  
    const formData = new FormData();
  
    this.selectedFiles.forEach(file => {
      formData.append('files', file); // Backend should expect 'files' as MultipartFile[]
    });
  
    formData.append('loanId', this.LoanId.toString()); // Ensure it's appended as a string
  
    this.verifyServ.upoladMultiplePhysicalDocs(formData).subscribe({
      next: (response: any) => {
        if (response.status === 'success') {
          this.toast.success({ detail: 'Success', summary: 'Files uploaded successfully!', duration: 3000 });
          this.resetState();
          this.close();
        } else {
          this.toast.error({ detail: 'Upload Failed', summary: response.message || 'Unknown error', duration: 3000 });
        }
      },
      error: (err) => {
        console.error('File upload error:', err);
        this.toast.error({ detail: 'Error', summary: 'Something went wrong during upload.', duration: 3000 });
      }
    });
  }

  resetState(): void {
    this.selectedFiles = [];
    this.selectedFileNames = [];
  }
  close(): void {
    this.closeModal.emit();
  }
}
