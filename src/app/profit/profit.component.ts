import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { ClientCache } from '../shared/client-cache';
import { AddClientService } from '../services/add-client.service';

@Component({
  selector: 'app-profit',
  templateUrl: './profit.component.html',
  styleUrls: ['./profit.component.css']
})
export class ProfitComponent implements OnInit {
  clients: { id: number, name: string }[] = [];
  filter = { client: 'All' };

  startDate: string = '';
  endDate: string = '';
  days: number | null = null;
  isSubmitted = false;

  result = { totalSales: 0, profit: 0 };

  private salesBaseUrl = `${environment.apiBaseUrl}/api/sales`;

  constructor(private http: HttpClient, private addClientService: AddClientService) {}

  ngOnInit(): void {
    this.loadClients();
  }

  private loadClients() {
    // Subscribe to global client cache
    ClientCache.clients$.subscribe(res => {
      this.clients = res;
    });

    // Fetch from backend only if cache not loaded
    if (!ClientCache.loaded) this.addClientService.refreshClients();
  }

  onSubmit() {
    if ((this.startDate && this.endDate && this.days) || (!this.days && (!this.startDate || !this.endDate))) {
      alert('⚠️ Please use either Date Range or Days filter — not both.');
      return;
    }

    let queryParams: string[] = [];

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
    if (clientId) queryParams.push(`clientId=${clientId}`);

    const url = `${this.salesBaseUrl}/profit/by-date-range?${queryParams.join('&')}`;

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
    this.result = { totalSales: 0, profit: 0 };
  }
}
