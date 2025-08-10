// src/app/services/add-client.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';  // import environment

@Injectable({
  providedIn: 'root'
})
export class AddClientService {

  private baseUrl = environment.apiBaseUrl;  // use environment variable

  constructor(private httpClient: HttpClient) { }

  addClient(obj: any) {
    const url = `${this.baseUrl}/api/clients/add`;
    return this.httpClient.post(url, obj);
  }

  registerUser(obj: any) {
    const url = `${this.baseUrl}/api/auth/add-user`;
    return this.httpClient.post(url, obj);
  }

  loginUser(obj: any) {
    const url = `${this.baseUrl}/api/auth/login`;
    return this.httpClient.post(url, obj);
  }

  sendOtp(obj: any) {
    const url = `${this.baseUrl}/api/auth/send-otp`;
    return this.httpClient.post(url, obj);
  }

  verifyOtp(obj: any) {
    const url = `${this.baseUrl}/api/auth/verify-otp`;
    return this.httpClient.post(url, obj);
  }

  forgetPassword(obj: any) {
    const url = `${this.baseUrl}/api/auth/reset-password-mail`;
    return this.httpClient.post(url, obj);
  }
}
