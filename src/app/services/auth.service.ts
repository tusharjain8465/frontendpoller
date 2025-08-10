// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn = false; // default false
  private logoutTimer: any;


  login(username: string, password: string) {
    // Instead of calling backend, just set loggedIn
    this.loggedIn = true;
    localStorage.setItem('loggedIn', 'true');
    this.startAutoLogout();

  }

  setLoggedIn(value: boolean) {
    this.loggedIn = value;
    localStorage.setItem('loggedIn', value.toString());
  }

  startAutoLogout() {
    clearTimeout(this.logoutTimer);
    this.logoutTimer = setTimeout(() => {
      console.log('Auto logout triggered after 10 minutes');
      this.logout();
    }, 10 * 60 * 1000); // 10 minutes
  }


  logout() {
    this.loggedIn = false;
    this.setLoggedIn(false);
    localStorage.removeItem('username');

    localStorage.removeItem('loggedIn');
    console.log('Is Logged In:', this.loggedIn); // ✅ Shows true/false
  }

  isLoggedIn(): boolean {
    return this.loggedIn || localStorage.getItem('loggedIn') === 'true';
  }
}
