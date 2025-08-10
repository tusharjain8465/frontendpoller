import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AddClientService } from 'src/app/services/add-client.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  hidePassword: boolean = true;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private clientsvc: AddClientService,
    private router: Router,
    private authservice: AuthService
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (!this.loginForm.valid) {
      this.errorMessage = 'Please enter both username and password.';
      return;
    }

    const { username, password } = this.loginForm.value;

    const loginPayload = { username: username.trim(), password };

    this.clientsvc.loginUser(loginPayload).subscribe({
      next: (res: any) => {
        console.log('✅ Login successful', res);

        localStorage.setItem('loggedIn', 'true');
        this.authservice.setLoggedIn(true);
        this.authservice.startAutoLogout();

        this.router.navigate(['central-navigation']).then(ok => {
          console.log('✅ Navigation result:', ok);
        });
      },
      error: (err) => {
        console.error('Login failed', err);
        alert("Login failed. Please check your credentials.");
      }
    });
  }

  navigateToRegister(): void {
    this.router.navigate(['/register']);
  }

  forgotPassword(): void {
    this.router.navigate(['forget-password']);
  }
}
