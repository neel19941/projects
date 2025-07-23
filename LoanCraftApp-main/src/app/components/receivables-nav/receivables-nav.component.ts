import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { PrivilegesService } from 'src/app/services/privileges.service';

@Component({
  selector: 'app-receivables-nav',
  standalone: true,
  imports: [CommonModule , RouterModule , ],
  templateUrl: './receivables-nav.component.html',
  styleUrls: ['./receivables-nav.component.scss']
})
export class ReceivablesNavComponent {
  protected privilegeServ = inject(PrivilegesService);

  constructor(private router: Router) {}

  navigateTo(route: string) {
    this.router.navigate([route]);
  }
}
