import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UcrfServiceService } from 'src/app/services/ucrf-service.service';
import { NgToastService } from 'ng-angular-popup';
import { PlainNavigationComponent } from '../plain-navigation/plain-navigation.component';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';

@Component({
  selector: 'app-ucrf-file-upload',
  standalone: true,
  imports: [CommonModule,
    PlainNavigationComponent
  ],
  templateUrl: './ucrf-file-upload.component.html',
  styleUrls: ['./ucrf-file-upload.component.scss']
})
export class UCRFFileUploadComponent {
  selectedFile: File | null = null;
  fileError: string = '';
  convertedData: string | null = null;
  isDownloadDisabled: boolean = true; // Initially disable download button

  constructor(private ucrfServ: UcrfServiceService, private toast: CustomToastService) {}

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const fileType = file.name.split('.').pop()?.toLowerCase();

      if (fileType !== 'xls' && fileType !== 'xlsx') {
        this.fileError = 'Only Excel files (.xls, .xlsx) are allowed';
        this.selectedFile = null;
      } else {
        this.fileError = '';
        this.selectedFile = file;
        this.isDownloadDisabled = true; // ✅ Disable download button when file is changed
      }
    }
  }

  uploadFile(event: Event, fileInput: HTMLInputElement) {
    event.preventDefault();
    if (!this.selectedFile) return;
  
    const formData = new FormData();
    formData.append('file', this.selectedFile);
  
    this.ucrfServ.ucrfConvertFile(formData).subscribe({
      next: (response: any) => {
        console.log('File uploaded successfully', response);
        this.toast.success({ detail: "SUCCESS", summary: 'Successfully Converted to UCRF format', duration: 5000 });

        this.convertedData = response.data;
        this.isDownloadDisabled = false; // ✅ Enable download button after successful conversion

        fileInput.value = ''; 
        this.selectedFile = null;
      },
      error: (error) => {
        console.error('Upload failed', error); 
        this.toast.error({ detail: "ERROR", summary: 'Failed to convert UCRF format.', duration: 5000 });
      }
    });
  }

  downloadTextFile(fileName: string = 'UCRF_Format.txt') {
    if (!this.convertedData) {
      this.toast.warning({ detail: "WARNING", summary: "Please convert file first", duration: 5000 });
      return;
    }

    const blob = new Blob([this.convertedData], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    this.isDownloadDisabled = true; // ✅ Disable download button after first use
  }
}
