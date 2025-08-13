import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ClientCache } from 'src/app/shared/client-cache';

interface Client {
  id: number;
  name: string;
}

interface Deposit {
  clientId: number;
  depositDate: string;  // Must match backend entity
  amount: number;
  note: string;
}

@Component({
  selector: 'app-add-deposit',
  templateUrl: './add-deposit.component.html',
  styleUrls: ['./add-deposit.component.css']
})
export class AddDepositComponent implements OnInit {

  clients: Client[] = [];
  selectedClientId: number | null = null;
  depositDate: string = '';
  amount: number | null = null;
  note: string = '';

  private depositBaseUrl = `${environment.apiBaseUrl}/api/deposits`;

  constructor(private router: Router, private http: HttpClient) { }

  ngOnInit(): void {
    // Initialize deposit date without seconds
    this.depositDate = this.getCurrentISTDateTimeNoSeconds();

    // Load clients from cache
    this.clients = ClientCache.clients$.getValue();

    // Subscribe to cache updates
    ClientCache.clients$.subscribe(clients => {
      this.clients = clients;
    });

    // Fetch clients from backend if cache is empty
    if (this.clients.length === 0) {
      this.http.get<Client[]>(`${environment.apiBaseUrl}/api/clients/all`).subscribe({
        next: clients => ClientCache.clients$.next(clients),
        error: err => console.error('Failed to fetch clients:', err)
      });
    }
  }

  saveDeposit() {
    if (!this.selectedClientId || !this.depositDate || !this.amount) {
      alert('Please fill all required fields!');
      return;
    }

    const newDeposit: Deposit = {
      clientId: this.selectedClientId,
      depositDate: this.depositDate,  // string like "2025-08-14T00:20"
      amount: this.amount,
      note: this.note
    };

    this.http.post(`${this.depositBaseUrl}/add`, newDeposit).subscribe({
      next: () => {
        alert('Deposit added successfully!');
        this.router.navigate(['/deposit']);
      },
      error: (err) => {
        console.error('Failed to save deposit:', err);
        alert('Failed to add deposit. Please try again.');
      }
    });
  }

  // Helper: Get current IST datetime without seconds (yyyy-MM-ddTHH:mm)
  private getCurrentISTDateTimeNoSeconds(): string {
    const now = new Date();
    const istOffsetMinutes = 330; // IST +5:30
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    const istTime = new Date(utc + istOffsetMinutes * 60000);

    const year = istTime.getFullYear();
    const month = String(istTime.getMonth() + 1).padStart(2, '0');
    const day = String(istTime.getDate()).padStart(2, '0');
    const hours = String(istTime.getHours()).padStart(2, '0');
    const minutes = String(istTime.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  cancel() {
    this.router.navigate(['/deposit']);
  }
}
