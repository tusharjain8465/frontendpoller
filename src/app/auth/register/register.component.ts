import { Component, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AddClientService } from 'src/app/services/add-client.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements AfterViewInit {
  registerForm: FormGroup;
  passwordStrength: number = 0;
  passwordStrengthLabel: string = '';
  passwordStrengthColor: string = '';
  submitting: boolean = false;

  constructor(private fb: FormBuilder , private clientsvc : AddClientService) {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3), Validators.pattern(/^[a-zA-Z0-9_]+$/)]],
      mobileNumber: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
      mail: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.matchPasswords });
  }

  ngAfterViewInit(): void {
    // Focus effects
    document.querySelectorAll('input').forEach(input => {
      input.addEventListener('focus', function () {
        this.parentElement?.classList.add('input-focus');
      });
      input.addEventListener('blur', function () {
        this.parentElement?.classList.remove('input-focus');
      });
    });
  }

  matchPasswords(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  getPasswordStrength(password: string): number {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  }

  onPasswordInput(): void {
    const password = this.registerForm.get('password')?.value || '';
    const strength = this.getPasswordStrength(password);
    this.passwordStrength = (strength / 5) * 100;

    if (strength <= 2) {
      this.passwordStrengthLabel = 'Weak';
      this.passwordStrengthColor = '#e74c3c';
    } else if (strength === 3) {
      this.passwordStrengthLabel = 'Medium';
      this.passwordStrengthColor = '#f39c12';
    } else {
      this.passwordStrengthLabel = 'Strong';
      this.passwordStrengthColor = '#27ae60';
    }
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      // this.submitting = true;

      this.clientsvc.registerUser(this.registerForm.value).subscribe(response => {

        // this.submitting = false;
        this.registerForm.reset();
        console.log(response)

      })
      // setTimeout(() => {
        // alert('Registration successful! Welcome aboard!');
      // }, 2000);
    } else {
      Object.values(this.registerForm.controls).forEach(control => {
        control.markAsTouched();
      });
      const firstInvalid = document.querySelector('.ng-invalid');
      firstInvalid?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  register(data:any) : void {

    


  }
}
