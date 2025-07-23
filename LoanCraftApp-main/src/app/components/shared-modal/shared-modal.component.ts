import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PersonalInfoComponent } from '../personal-info/personal-info.component';

@Component({
  selector: 'app-shared-modal',
  standalone: true,
  imports: [CommonModule,PersonalInfoComponent],
  templateUrl: './shared-modal.component.html',
  styleUrls: ['./shared-modal.component.scss']
})
export class SharedModalComponent {

  @Input() isPersonalInfo = false;  // Input to control modal visibility
  @Output() close = new EventEmitter<void>();  // EventEmitter to close the modal

  closeModal() {
    this.close.emit();  // Emit close event
  }
}
