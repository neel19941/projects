import { Component } from '@angular/core';
import { InactivityService } from './core/services/inactivity.service';

interface sideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'LoanCraft';
  isSideNavCollapsed = false;
  screenWidth = 0; 
  // constructor(private inactivityService: InactivityService) {}
  // onToggleSideNav(data : sideNavToggle): void{
  //       this.screenWidth = data.screenWidth;
  // }
  onToggleSideNav(data: sideNavToggle): void {
    this.isSideNavCollapsed = data.collapsed;
    this.screenWidth = data.screenWidth;
  }
  
}
