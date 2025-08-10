import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-client-management',
  templateUrl: './client-management.component.html',
  styleUrls: ['./client-management.component.css']
})
export class ClientManagementComponent {

  constructor(private router: Router) {}

  navigateToAddClient() {
    this.router.navigate(['/add-client']);
  }

  navigateToExistingClients() {
    this.router.navigate(['/existing-clients']);
  }
}
