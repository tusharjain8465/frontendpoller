import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-profit',
  templateUrl: './profit.component.html',
  styleUrls: ['./profit.component.css']
})
export class ProfitComponent implements OnInit {
  clients: { id: number, name: string }[] = [];
  filter = {
    client: 'All'
  };

  startDate: string = '';
  endDate: string = '';
  days: number | null = null;
  isSubmitted = false;

  result = {
    totalSales: 0,
    profit: 0
  };

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadClients();
  }

  loadClients() {
    this.http.get<any[]>('http://localhost:8080/api/clients/all').subscribe({
      next: data => {
        this.clients = data;
      },
      error: err => {
        console.error('Error fetching clients:', err);
      }
    });
  }

 onSubmit() {
  if ((this.startDate && this.endDate && this.days) || (!this.days && (!this.startDate || !this.endDate))) {
    alert('⚠️ Please use either Date Range or Days filter — not both.');
    return;
  }

  let queryParams = [];

  if (this.startDate && this.endDate) {
    const from = `${this.startDate} 00:00:00`;
    const to = `${this.endDate} 23:59:59`;
    queryParams.push(`from=${encodeURIComponent(from)}`);
    queryParams.push(`to=${encodeURIComponent(to)}`);
  }

  if (this.days != null && this.days > 0) {
    queryParams.push(`days=${this.days}`);
  }

  const clientId = this.filter.client === 'All' ? '' : this.filter.client;
  if (clientId) {
    queryParams.push(`clientId=${clientId}`);
  }

  const url = `http://localhost:8080/api/sales/profit/by-date-range?${queryParams.join('&')}`;

  this.http.get<any>(url).subscribe({
    next: (data) => {
      this.result.totalSales = data.sale;
      this.result.profit = data.profit;
      this.isSubmitted = true;
    },
    error: (err) => {
      console.error('Error fetching profit data:', err);
    }
  });
}


  resetFilter() {
    this.filter.client = 'All';
    this.startDate = '';
    this.endDate = '';
    this.days = null;
    this.isSubmitted = false;
    this.result = {
      totalSales: 0,
      profit: 0
    };
  }
}
