import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

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

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadClients();
    this.fetchAllSales();
  }

  loadClients(): void {
    this.http.get<any[]>('http://localhost:8080/api/clients/all')
      .subscribe(data => {
        this.clients = data;
      });
  }

  filterSales(): void {
    if (this.selectedClient) {
      this.http.get<SaleEntry[]>(`http://localhost:8080/api/sales/by-client/${this.selectedClient}`)
        .subscribe(data => {
          this.groupedSales = this.groupSalesByDate(data);
        });
    } else {
      this.fetchAllSales();
    }
  }

  fetchAllSales(): void {
    this.http.get<SaleEntry[]>('http://localhost:8080/api/sales/all-sales/all')
      .subscribe(data => {
        this.groupedSales = this.groupSalesByDate(data);
      });
  }

  groupSalesByDate(sales: SaleEntry[]): GroupedSales[] {
    const grouped: { [date: string]: SaleEntry[] } = {};

    for (const sale of sales) {
      const date = sale.saleDateTime.split('T')[0];

      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(sale);
    }

    return Object.entries(grouped).map(([date, entries]) => ({
      date,
      entries
    }));
  }

}
