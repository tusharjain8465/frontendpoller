import { Component, OnInit, OnDestroy } from '@angular/core';
import { ClientCache } from '../shared/client-cache';
import { Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

interface Client {
  id: number;
  name: string;
}

interface Deposit {
  id: number;
  clientId: number;
  clientName: string;
  depositDate: string; // backend field
  formattedDate?: string; // for display in UI
  amount: number;
  note: string;
  isEditing?: boolean; // track edit mode
  tempAmount?: number;  // temporary amount for editing
  tempNote?: string;    // temporary note for editing
}

@Component({
  selector: 'app-deposit',
  templateUrl: './deposit.component.html',
  styleUrls: ['./deposit.component.css']
})
export class DepositComponent implements OnInit, OnDestroy {

  clients: Client[] = [];
  deposits: Deposit[] = [];
  filteredDeposits: Deposit[] = [];

  selectedClientId: number | null = null;
  private clientSub: Subscription | null = null;

  private clientBaseUrl = `${environment.apiBaseUrl}/api/clients`;
  private depositBaseUrl = `${environment.apiBaseUrl}/api/deposits`;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.clients = ClientCache.clients$.getValue();

    this.clientSub = ClientCache.clients$.subscribe(clients => {
      this.clients = clients;
      this.updateDepositClientNames();
    });

    if (this.clients.length === 0) {
      this.http.get<Client[]>(`${this.clientBaseUrl}/all`).subscribe({
        next: clients => ClientCache.clients$.next(clients),
        error: err => console.error('Failed to fetch clients:', err)
      });
    }

    this.fetchDeposits();
  }

  ngOnDestroy(): void {
    this.clientSub?.unsubscribe();
  }

  fetchDeposits(): void {
    this.http.get<Deposit[]>(`${this.depositBaseUrl}/all`).subscribe({
      next: (deposits) => {
        this.deposits = deposits.map(d => ({
          ...d,
          clientName: this.getClientNameById(d.clientId),
          formattedDate: this.formatDepositDate(d.depositDate)
        }));
        this.filteredDeposits = [...this.deposits];
      },
      error: err => console.error('Failed to fetch deposits:', err)
    });
  }

  getClientNameById(clientId: number): string {
    const client = this.clients.find(c => c.id === clientId);
    return client ? client.name : 'Unknown';
  }

  updateDepositClientNames(): void {
    this.deposits = this.deposits.map(d => ({
      ...d,
      clientName: this.getClientNameById(d.clientId)
    }));
    this.filterByClient();
  }

  filterByClient(): void {
    if (this.selectedClientId) {
      this.filteredDeposits = this.deposits.filter(d => d.clientId === this.selectedClientId);
    } else {
      this.filteredDeposits = [...this.deposits];
    }
  }

  // ---------------- Edit & Delete ----------------

  editDeposit(deposit: Deposit) {
    deposit.isEditing = true;
    deposit.tempAmount = deposit.amount;
    deposit.tempNote = deposit.note;
  }

  discardChanges(deposit: Deposit) {
    deposit.isEditing = false;
    deposit.tempAmount = deposit.amount;
    deposit.tempNote = deposit.note;
  }

  submitEdit(deposit: Deposit) {
    if (deposit.tempAmount == null) {
      alert('Amount cannot be empty!');
      return;
    }

    const updatedDeposit = {
      amount: deposit.tempAmount,
      note: deposit.tempNote || ''
    };

    this.http.put(`${this.depositBaseUrl}/update/${deposit.id}`, updatedDeposit).subscribe({
      next: () => {
        deposit.amount = deposit.tempAmount!;
        deposit.note = deposit.tempNote || '';
        deposit.isEditing = false;
      },
      error: err => console.error('Failed to update deposit:', err)
    });
  }

  deleteDeposit(deposit: Deposit) {
    if (!confirm('Are you sure you want to delete this deposit?')) return;

    this.http.delete(`${this.depositBaseUrl}/delete/${deposit.id}`).subscribe({
      next: () => {
        this.deposits = this.deposits.filter(d => d.id !== deposit.id);
        this.filterByClient();
      },
      error: err => console.error('Failed to delete deposit:', err)
    });
  }


  // Helper: format deposit date as "14 May 2025 12:43 AM"
  private formatDepositDate(dateStr: string): string {
    if (!dateStr) return '';
    const date = new Date(dateStr);

    const day = date.getDate();
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();

    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // 0 => 12

    return `${day} ${month} ${year} ${hours}:${minutes} ${ampm}`;
  }

}
