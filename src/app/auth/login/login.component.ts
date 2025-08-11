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
  otpSent: boolean = false;
  otpVerified: boolean = false;
  errorMessage: string = '';
  username: string = '';
  password: string = '';



  constructor(
    private fb: FormBuilder,
    private clientsvc: AddClientService,
    private router: Router,
    private authservice: AuthService
  ) {
    this.loginForm = this.fb.group({
      username: [''],
      mail: [''],
      mobileNumber: [''],
      password: ['', Validators.required]
    });

    this.setupFieldMutualExclusion();
  }

  setupFieldMutualExclusion(): void {
    this.loginForm.get('username')?.valueChanges.subscribe(val => {
      if (val) {
        this.loginForm.get('mail')?.disable({ emitEvent: false });
        this.loginForm.get('mobileNumber')?.disable({ emitEvent: false });
      } else {
        this.enableIfAllEmpty();
      }
    });

    this.loginForm.get('mail')?.valueChanges.subscribe(val => {
      if (val) {
        this.loginForm.get('username')?.disable({ emitEvent: false });
        this.loginForm.get('mobileNumber')?.disable({ emitEvent: false });
      } else {
        this.enableIfAllEmpty();
      }
    });

    this.loginForm.get('mobileNumber')?.valueChanges.subscribe(val => {
      if (val) {
        this.loginForm.get('username')?.disable({ emitEvent: false });
        this.loginForm.get('mail')?.disable({ emitEvent: false });
      } else {
        this.enableIfAllEmpty();
      }
    });
  }

  enableIfAllEmpty(): void {
    const username = this.loginForm.get('username')?.value;
    const mail = this.loginForm.get('mail')?.value;
    const mobile = this.loginForm.get('mobileNumber')?.value;

    if (!username && !mail && !mobile) {
      this.loginForm.get('username')?.enable({ emitEvent: false });
      this.loginForm.get('mail')?.enable({ emitEvent: false });
      this.loginForm.get('mobileNumber')?.enable({ emitEvent: false });
    }
  }



  onSubmit(): void {
    if (!this.loginForm.valid) {
      this.errorMessage = 'Please enter a valid password and one of username/mail/mobile.';
      return;
    }

    const { username, mail, mobileNumber, password } = this.loginForm.value;

    if (!username && !mail && !mobileNumber) {
      this.errorMessage = 'Please provide at least one identifier.';
      return;
    }

    const loginPayload = {
      username: username || '',
      mail: mail || '',
      mobileNumber: mobileNumber || '',
      password
    };


    const storedUsername = (username || mail || mobileNumber || '').trim().toLowerCase();

    this.clientsvc.loginUser(loginPayload).subscribe({
      next: (res: any) => {
        console.log('✅ Login successful', res);

        // Mark user as logged in
        localStorage.setItem('loggedIn', 'true');

        this.router.navigate(['central-navigation']).then(ok => {
          console.log('✅ Navigation result:', ok);
        });
        this.authservice.startAutoLogout()
      }

      ,
      error: (err) => {
        console.error('Login failed', err);
        if (err.status === 200 || err.status === 201) {
          localStorage.setItem('username', this.username.trim().toLowerCase());
          localStorage.setItem('username', storedUsername);
          this.authservice.setLoggedIn(true);
          this.authservice.startAutoLogout();
          localStorage.setItem('loggedIn', 'true');
          console.warn("Backend returned success-like status inside error block. Navigating...");
          this.authservice.startAutoLogout()

          this.router.navigate(['/central-navigation']);

        } else {
          console.error("Login failed with status:", err.status);
          alert("Login failed. Please check your credentials.");
        }
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
