import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { ClientCache } from '../shared/client-cache';
import { AddClientService } from '../services/add-client.service';

interface SaleEntry {
  accessoryName: string;
  quantity?: number;
  totalPrice: number;
  profit?: number;
  returnFlag?: boolean;
  saleDateTime: string;
  clientName: string;
  note?: string;
}

interface GroupedSales {
  date: string;
  entries: SaleEntry[];
}

@Component({
  selector: 'app-view-history',
  templateUrl: './view-history.component.html',
  styleUrls: ['./view-history.component.css']
})
export class ViewHistoryComponent implements OnInit {

  clients: any[] = [];
  selectedClient: string = '';
  groupedSales: GroupedSales[] = [];

  private salesBaseUrl = `${environment.apiBaseUrl}/api/sales`;

  constructor(private http: HttpClient, private addClientService: AddClientService) {}

  ngOnInit(): void {
    this.loadClients();
    this.fetchAllSales();
  }

  private loadClients(): void {
    // Subscribe to global client cache
    ClientCache.clients$.subscribe(res => {
      this.clients = res;
    });

    // Fetch from backend only if cache not loaded
    if (!ClientCache.loaded) this.addClientService.refreshClients();
  }

  filterSales(): void {
    if (this.selectedClient) {
      this.http.get<SaleEntry[]>(`${this.salesBaseUrl}/by-client/${this.selectedClient}`)
        .subscribe(data => {
          this.groupedSales = this.groupSalesByDate(data);
        });
    } else {
      this.fetchAllSales();
    }
  }

  fetchAllSales(): void {
    this.http.get<SaleEntry[]>(`${this.salesBaseUrl}/all-sales/all`)
      .subscribe(data => {
        this.groupedSales = this.groupSalesByDate(data);
      });
  }

  private groupSalesByDate(sales: SaleEntry[]): GroupedSales[] {
    const grouped: { [date: string]: SaleEntry[] } = {};

    for (const sale of sales) {
      const date = sale.saleDateTime.split('T')[0];
      if (!grouped[date]) grouped[date] = [];
      grouped[date].push(sale);
    }

    return Object.entries(grouped).map(([date, entries]) => ({ date, entries }));
  }

}
