import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-central-navigation',
  templateUrl: './central-navigation.component.html',
  styleUrls: ['./central-navigation.component.css']
})
export class CentralNavigationComponent implements OnInit {
  username: string = '';
  isVishal: boolean = false;

  constructor(private router: Router , private service: AuthService) { }

  ngOnInit() {
    // ✅ Always use one storage type — here using localStorage
    this.username = (localStorage.getItem('username') || '').toLowerCase();
    this.isVishal = this.username === 'vishal';

    // ✅ Redirect to login if not logged in
    if (!this.username) {
      this.router.navigate(['/login']);
    }
  }

  navigate(path: string) {
    // ✅ Vishal has full access, others only to sales-management
    if (this.isVishal || path === '/sales-management') {
      this.router.navigate([path]);
    } else {
      alert('Access Denied: You do not have permission to view this page.');
    }
  }
}
