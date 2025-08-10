import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Client } from '../models/client.model';

@Injectable({
  providedIn: 'root'
})


export class ExistingClientService {
  private clientBaseUrl = 'http://localhost:8080/api/clients';
  private salesBaseUrl = 'http://localhost:8080/api/sales';

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
    return this.http.delete(`${this.clientBaseUrl}/delete/${id}`, { responseType: 'text' });
  }

  // ✅ 5. Confirm/Edit a sale entry by client ID and sale ID
  confirmEditSales(id: number, data: any) {
    return this.http.put(`${this.salesBaseUrl}/edit/${id}`, data, { responseType: 'text' });
  }

  // ✅ 6. Delete a sale entry by sale ID
  confirmDeleteSales(id: number) {
    return this.http.delete(`${this.salesBaseUrl}/delete/${id}`, { responseType: 'text' });

  }



}