import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrivilegesService } from 'src/app/services/privileges.service';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-employer-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './employer-dashboard.component.html',
  styleUrls: ['./employer-dashboard.component.scss']
})
export class EmployerDashboardComponent {


  userform!:FormGroup
   userid =localStorage.getItem('userId')

  protected privilegeServ = inject(PrivilegesService);

}
