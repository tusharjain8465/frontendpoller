import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Client } from '../models/client.model';
import { environment } from '../../environments/environment';
import { tap } from 'rxjs/operators';
import { ClientCache } from '../shared/client-cache';


@Injectable({
  providedIn: 'root'
})
export class ExistingClientService {
  private clientBaseUrl = `${environment.apiBaseUrl}/api/clients`;
  private salesBaseUrl = `${environment.apiBaseUrl}/api/sales`;

  private baseUrl = environment.apiBaseUrl;


  constructor(private http: HttpClient) { }


  // 1. Get all clients
  getAllClients(): Observable<Client[]> {
    return this.http.get<Client[]>(`${this.clientBaseUrl}/all`);
  }

  // 2. Get client by ID
  getClientById(id: number): Observable<Client> {
    return this.http.get<Client>(`${this.clientBaseUrl}/${id}`);
  }

  // 3. Edit client
  updateClient(id: number, data: Partial<Client>): Observable<Client> {
    return this.http.put<Client>(`${this.clientBaseUrl}/edit/${id}`, data);
  }

  // 4. Delete client
  deleteClient(id: number): Observable<string> {
    return this.http.delete(`${this.clientBaseUrl}/delete/${id}`, { responseType: 'text' }).pipe(
      tap(() => {
        // Refresh client cache automatically after add
        this.refreshClients();
      })
    );
  }

  refreshClients() {
    this.http.get<any[]>(`${this.baseUrl}/api/clients/all`).subscribe({
      next: (res) => ClientCache.setClients(res),
      error: (err) => console.error('Failed to refresh clients:', err)
    });
  }

  // 5. Confirm/Edit a sale entry by client ID and sale ID
  confirmEditSales(id: number, data: any) {
    return this.http.put(`${this.salesBaseUrl}/edit/${id}`, data, { responseType: 'text' });
  }

  // 6. Delete a sale entry by sale ID
  confirmDeleteSales(id: number) {
    return this.http.delete(`${this.salesBaseUrl}/delete/${id}`, { responseType: 'text' });
  }
}
