import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SalesService {
  private BASE_URL = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  getAllClients(): Observable<any[]> {
    return this.http.get<any[]>(`${this.BASE_URL}/clients/all`);
  }

  getSalesByClientAndDateRange(clientId: string, from: string, to: string): Observable<any[]> {
    const params = new HttpParams()
      .set('clientId', clientId)
      .set('from', from)
      .set('to', to);
    return this.http.get<any[]>(`${this.BASE_URL}/sales/by-client-and-date-range`, { params });
  }

  updateSaleEntry(payload: {
    saleEntryId: number;
    totalPrice: number;
    profit: number;
    accessory: string;
  }): Observable<string> {
    return this.http.patch(`${this.BASE_URL}/sales/sale-entry/few-attributes`, payload, {
      responseType: 'text'
    });
  }
}
