import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'front-end';

  constructor(private router: Router, private service: AuthService) {}

  logout() {
    this.service.setLoggedIn(false);

    localStorage.removeItem('username');
    console.log("Is logged in?", !!localStorage.getItem('username')); // false after logout

    this.router.navigate(['/login']);
  }
}
