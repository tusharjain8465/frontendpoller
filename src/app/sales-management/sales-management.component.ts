import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

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
    saleDateTime: '', // will be initialized on ngOnInit
    clientId: 0,
    accessoryName: '',
    note: '',
    totalPrice: '',
    profit: '',
    returnFlag: false
  };

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    const today = new Date().toISOString().substring(0, 10); // "YYYY-MM-DD"
    this.saleForm.saleDateTime = today;
    this.getClients();
  }

  toggleSaleType(type: 'sale' | 'return') {
    this.saleType = type;
    this.returnFlag = (type === 'return');
  }

  onSubmit() {
    const salePayload = {
      ...this.saleForm,
      saleDateTime: this.saleForm.saleDateTime + 'T00:00:00',
      returnFlag: this.returnFlag
    };

    console.log("Submitted", salePayload, "Type:", this.saleType);
    alert(`✅ ${this.saleType === 'sale' ? 'Sale' : 'Return'} entry submitted successfully!`);

    this.http
      .post('http://localhost:8080/api/sales/sale-entry/add', salePayload)
      .subscribe(() => {
        alert("Entry is added successfully!!!");
      });

    // Reset form (keep today's date)
    const today = new Date().toISOString().substring(0, 10);
    this.saleForm = {
      saleDateTime: today,
      clientId: 0,
      accessoryName: '',
      note: '',
      totalPrice: '',
      profit: '',
      returnFlag: this.saleType === 'return'
    };
  }

  getClients() {
    this.http.get<any[]>('http://localhost:8080/api/clients/all')
      .subscribe({
        next: (res) => this.clients = res,
        error: (err) => console.error('Failed to fetch clients:', err)
      });
  }
}
