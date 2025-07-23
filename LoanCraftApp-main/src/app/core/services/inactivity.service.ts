import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Injectable({
  providedIn: 'root'
})

export class InactivityService {
  
  private inactivityTime: number = 1 * 60 * 1000; // 15 minutes in milliseconds
  private timeoutId: any;
  constructor(private authService: AuthService, private router: Router) {
    this.startInactivityTimer();
    this.listenForUserActivity();
  }

  private startInactivityTimer() {
    this.resetTimer();
  }

  private resetTimer() {
    clearTimeout(this.timeoutId);
    this.timeoutId = setTimeout(() => this.logoutUser(), this.inactivityTime);
  }

  private listenForUserActivity() {
    window.addEventListener('mousemove', () => this.resetTimer());
    window.addEventListener('keydown', () => this.resetTimer());
    window.addEventListener('click', () => this.resetTimer());
    window.addEventListener('scroll', () => this.resetTimer());
  }

  private logoutUser() {
    this.authService.isLogOut(); // Call logout function
    this.router.navigate(['/customer-login']); // Redirect to login page
  }
}
