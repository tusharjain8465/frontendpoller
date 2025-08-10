import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';  // import environment

interface SaleEntry {
  id: number;
  date: string;               // or saleDateTime: string;
  clientName: string;
  accessoryName: string;
  totalPrice: number;
  profit: number;
  quantity: number;           // ✅ Add this
  saleDateTime: string;       // ✅ Add this
  returnFlag: boolean;        // ✅ Add this
  isEditing?: boolean;        // Optional for UI
}

@Component({
  selector: 'app-view-sales',
  templateUrl: './view-sales.component.html',
  styleUrls: ['./view-sales.component.css'],
})
export class ViewSalesComponent implements OnInit {
  Object = Object;

  clients: any[] = [];
  salesEntries: SaleEntry[] = [];
  groupedEntries: { [date: string]: SaleEntry[] } = {};

  selectedClientId: string = '';
  startDate: string = '';
  endDate: string = '';

  private clientBaseUrl = `${environment.apiBaseUrl}/api/clients`;
  private salesBaseUrl = `${environment.apiBaseUrl}/api/sales`;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchClients();
    this.fetchSales();
  }

  fetchClients(): void {
    this.http.get<any[]>(`${this.clientBaseUrl}/all`).subscribe((res) => {
      this.clients = res;
    });
  }

  fetchSales(): void {
    let url = `${this.salesBaseUrl}/all-sales/all`;
    if (this.selectedClientId) {
      url = `${this.salesBaseUrl}/by-client/${this.selectedClientId}`;
    }

    this.http.get<SaleEntry[]>(url).subscribe((res) => {
      this.salesEntries = res.map((entry: any) => ({
        ...entry,
        isEditing: false,
        date: entry.saleDateTime?.split('T')[0] || '', // for grouping
      }));
      this.filterEntries();
    });
  }

  filterEntries(): void {
    let filtered = [...this.salesEntries];

    if (this.startDate) {
      filtered = filtered.filter((e) => e.date! >= this.startDate);
    }

    if (this.endDate) {
      filtered = filtered.filter((e) => e.date! <= this.endDate);
    }

    this.groupedEntries = {};
    for (const entry of filtered) {
      const date = entry.date!;
      if (!this.groupedEntries[date]) {
        this.groupedEntries[date] = [];
      }
      this.groupedEntries[date].push(entry);
    }
  }

  resetFilters(): void {
    this.selectedClientId = '';
    this.startDate = '';
    this.endDate = '';
    this.fetchSales();
  }

  deleteEntry(entry: SaleEntry): void {
    const confirmed = confirm(`Are you sure you want to delete "${entry.accessoryName}"?`);
    if (confirmed) {
      this.http
        .delete(`${this.salesBaseUrl}/delete/${entry.id}`)
        .subscribe(() => {
          this.fetchSales();
        }, () => {
          this.fetchSales();
        });
    }
  }

  selectedEditData: SaleEntry | any = {};

  enableEdit(entry: SaleEntry): void {
    entry.isEditing = true;
    this.selectedEditData = { ...entry };
  }

  submitEdit(entry: SaleEntry): void {
    const patchPayload = {
      accessoryName: entry.accessoryName,
      quantity: entry.quantity,
      totalPrice: entry.totalPrice,
      profit: entry.profit,
      saleDateTime: entry.saleDateTime.split('.')[0], // remove milliseconds if any
      returnFlag: entry.returnFlag,
      clientName: entry.clientName,
      id: entry.id
    };

    this.http
      .put(`${this.salesBaseUrl}/edit/${entry.id}`, patchPayload)
      .subscribe(() => {
        entry.isEditing = false;
        this.fetchSales();
      });
  }

  filterSaleEnttries() {
    this.fetchSales();
  }

  discard(data: SaleEntry) {
    data.totalPrice = this.selectedEditData.totalPrice;
    data.accessoryName = this.selectedEditData.accessoryName;
    data.profit = this.selectedEditData.profit;
    data.isEditing = false;
  }
}
