import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AddClientService } from 'src/app/services/add-client.service';

@Component({
  selector: 'app-forgetpassword',
  templateUrl: './forgetpassword.component.html',
  styleUrls: ['./forgetpassword.component.css']
})
export class ForgotPasswordComponent {
  forgotPasswordForm: FormGroup;
  hidePassword: boolean = true;
  otpSent: boolean = false;

  constructor(private fb: FormBuilder, private clientSvc: AddClientService, private router :Router) {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      otpCode: ['', [Validators.required, Validators.pattern('^[0-9]{6}$')]],
    });
  }

  sendOtp(): void {
    const email = this.forgotPasswordForm.get('email')?.value;
    if (email) {
      this.otpSent = true;

      this.clientSvc.sendOtp({email:email}).subscribe(response => {
        console.log(response);
      });

      alert(`OTP sent to ${email}`);
      // Call backend API to send OTP here
    }
  }

  verifyOtpAndReset(): void {
    if (this.forgotPasswordForm.valid) {
       this.clientSvc.forgetPassword(this.forgotPasswordForm.value).subscribe(response => {
        console.log(response);
      });


      this.router.navigate(['/central-navigation'])

      
      // Call backend API to verify OTP and reset password
    } else {
      alert('Please fill all fields correctly.');
    }
  }
}
