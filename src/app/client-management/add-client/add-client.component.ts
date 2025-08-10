import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AddClientService } from 'src/app/services/add-client.service';

@Component({
  selector: 'app-add-client',
  templateUrl: './add-client.component.html',
  styleUrls: ['./add-client.component.css']
})
export class AddClientComponent {
  clientForm: FormGroup;
  showToast = false;

  constructor(private fb: FormBuilder,
    private addClient: AddClientService
  ) {
    this.clientForm = this.fb.group({
      clientName: ['', Validators.required],
      location: [''],
      contact: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]]
    });
  }

  onSubmit(): void {
    if (this.clientForm.valid) {
      const payload = {
        name: this.clientForm.get('clientName')?.value,
        location: this.clientForm.get('location')?.value,
        contact: this.clientForm.get('contact')?.value
      }

      this.addClient.addClient(payload).subscribe({
        next: (res: any) => {
          this.showToast = true;
          setTimeout(() => this.showToast = false, 3000);
          this.clientForm.reset();
        },
        error: (err: any) => {
          // handle error
          console.error('Error:', err);
        }
      });


      console.log('Client Saved:', this.clientForm.value);

    }
  }

  get contactInvalid() {
    const control = this.clientForm.get('contact');
    return control?.invalid && (control.dirty || control.touched);
  }
}
