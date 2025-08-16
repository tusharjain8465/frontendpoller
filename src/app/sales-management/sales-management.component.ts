import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { ClientCache } from '../shared/client-cache';
import { AddClientService } from '../services/add-client.service';

@Component({
  selector: 'app-sales-management',
  templateUrl: './sales-management.component.html',
  styleUrls: ['./sales-management.component.css']
})
export class SalesManagementComponent implements OnInit {

  clients: any[] = [];
  saleType: 'sale' | 'return' = 'sale';
  returnFlag: boolean = false;
  isSubmitting: boolean = false;

  saleForm: any = {
    saleDateTime: '',
    clientId: 0,
    accessoryName: '',
    note: '',
    totalPrice: '',
    profit: '',
    returnFlag: false
  };

  private salesBaseUrl = `${environment.apiBaseUrl}/api/sales`;

  constructor(private http: HttpClient, private addClientService: AddClientService) { }

  ngOnInit(): void {
    this.saleForm.saleDateTime = this.getCurrentISTDateTime();
    this.loadClients();
  }

  // Helper: Get current IST date-time in "yyyy-MM-ddTHH:mm:ss" format
  private getCurrentISTDateTime(): string {
    const now = new Date();
    const istOffsetMinutes = 330; // IST = UTC+5:30
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    const istTime = new Date(utc + (istOffsetMinutes * 60000));

    const year = istTime.getFullYear();
    const month = String(istTime.getMonth() + 1).padStart(2, '0');
    const day = String(istTime.getDate()).padStart(2, '0');
    const hours = String(istTime.getHours()).padStart(2, '0');
    const minutes = String(istTime.getMinutes()).padStart(2, '0');
    const seconds = String(istTime.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  }

  private loadClients() {
    // Subscribe to reactive client cache
    ClientCache.clients$.subscribe(res => this.clients = res);

    // Fetch from backend only if cache is empty
    if (!ClientCache.loaded) this.addClientService.refreshClients();
  }

  toggleSaleType(type: 'sale' | 'return') {
    this.saleType = type;
    this.returnFlag = (type === 'return');
  }

  onSubmit() {
    if (this.isSubmitting) return;
    this.isSubmitting = true;

    let saleDateTime = this.saleForm.saleDateTime;
    if (saleDateTime && saleDateTime.length === 16) saleDateTime += ":00";

    const salePayload = {
      ...this.saleForm,
      saleDateTime,
      returnFlag: this.returnFlag,
      totalPrice: Number(this.saleForm.totalPrice),
      profit: Number(this.saleForm.profit),
      quantity: this.saleForm.quantity ? Number(this.saleForm.quantity) : 1
    };

    this.http.post(`${this.salesBaseUrl}/sale-entry/add`, salePayload, { responseType: 'text' })
      .subscribe({
        next: () => {
          this.playBeep(); // <-- Play beep here
          alert(`✅ ${this.saleType === 'sale' ? 'Sale' : 'Return'} entry submitted successfully!`);
          this.resetForm();
          this.isSubmitting = false;
        },
        error: (err) => {
          console.error('Failed to submit sale entry:', err);
          alert("❌ Failed to submit entry. Please try again.");
          this.isSubmitting = false;
        }
      });
  }

  // Beep function
  private playBeep() {
    const context = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = context.createOscillator();
    oscillator.type = 'square';
    oscillator.frequency.setValueAtTime(440, context.currentTime); // A4 note
    oscillator.connect(context.destination);
    oscillator.start();
    oscillator.stop(context.currentTime + 0.2); // 0.2 sec beep
  }

  private resetForm() {
    this.saleForm = {
      saleDateTime: this.getCurrentISTDateTime(),
      clientId: 0,
      accessoryName: '',
      note: '',
      totalPrice: '',
      profit: '',
      returnFlag: this.saleType === 'return'
    };
  }
}
