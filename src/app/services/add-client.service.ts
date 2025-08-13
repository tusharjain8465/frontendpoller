import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { tap } from 'rxjs/operators';
import { ClientCache } from '../shared/client-cache';

@Injectable({
  providedIn: 'root'
})
export class AddClientService {

  private baseUrl = environment.apiBaseUrl;

  constructor(private httpClient: HttpClient) { }

  addClient(obj: any) {
    const url = `${this.baseUrl}/api/clients/add`;
    return this.httpClient.post(url, obj).pipe(
      tap(() => {
        // Refresh client cache automatically after add
        this.refreshClients();
      })
    );
  }

  // Fetch all clients and update cache
  refreshClients() {
    this.httpClient.get<any[]>(`${this.baseUrl}/api/clients/all`).subscribe({
      next: (res) => ClientCache.setClients(res),
      error: (err) => console.error('Failed to refresh clients:', err)
    });
  }

  // Other existing methods
  registerUser(obj: any) { return this.httpClient.post(`${this.baseUrl}/api/auth/add-user`, obj); }
  loginUser(obj: any) { return this.httpClient.post(`${this.baseUrl}/api/auth/login`, obj); }
  sendOtp(obj: any) { return this.httpClient.post(`${this.baseUrl}/api/auth/send-otp`, obj); }
  verifyOtp(obj: any) { return this.httpClient.post(`${this.baseUrl}/api/auth/verify-otp`, obj); }
  forgetPassword(obj: any) { return this.httpClient.post(`${this.baseUrl}/api/auth/reset-password-mail`, obj); }
}
