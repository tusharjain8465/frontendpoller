import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';  // import environment

@Component({
  selector: 'app-sales-management',
  templateUrl: './sales-management.component.html',
  styleUrls: ['./sales-management.component.css']
})
export class SalesManagementComponent implements OnInit {

  clients: any[] = [];
  saleType: 'sale' | 'return' = 'sale';
  returnFlag: boolean = false;

  saleForm: any = {
    saleDateTime: '', // will be set on ngOnInit
    clientId: 0,
    accessoryName: '',
    note: '',
    totalPrice: '',
    profit: '',
    returnFlag: false
  };

  private salesBaseUrl = `${environment.apiBaseUrl}/api/sales`;
  private clientBaseUrl = `${environment.apiBaseUrl}/api/clients`;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    // Set today's date and time in IST when form loads
    this.saleForm.saleDateTime = this.getCurrentISTDateTime();
    this.getClients();
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


  toggleSaleType(type: 'sale' | 'return') {
    this.saleType = type;
    this.returnFlag = (type === 'return');
  }

  onSubmit() {
    // Prepare payload with actual IST date-time
    const salePayload = {
      ...this.saleForm,
      saleDateTime: this.getCurrentISTDateTime(),
      returnFlag: this.returnFlag
    };

    console.log("Submitted Payload:", salePayload);

    this.http.post(`${this.salesBaseUrl}/sale-entry/add`, salePayload)
      .subscribe({
        next: () => {
          alert(`✅ ${this.saleType === 'sale' ? 'Sale' : 'Return'} entry submitted successfully!`);
          this.resetForm();
        },
        error: (err) => {
          console.error("Failed to submit sale entry:", err);
          alert("❌ Failed to add entry.");
        }
      });
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

  getClients() {
    this.http.get<any[]>(`${this.clientBaseUrl}/all`)
      .subscribe({
        next: (res) => this.clients = res,
        error: (err) => console.error('Failed to fetch clients:', err)
      });
  }
}
