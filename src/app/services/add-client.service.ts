import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AddClientService {

  constructor(private httpClient: HttpClient) { }


  addClient(obj: any) {
    const url = 'http://localhost:8080/api/clients/add'

    let response = this.httpClient.post(url, obj);
    return response;
  }



  registerUser(obj: any) {
    const url = 'http://localhost:8080/api/auth/add-user'

    let response = this.httpClient.post(url, obj);
    return response;
  }


  loginUser(obj: any) {
    const url = 'http://localhost:8080/api/auth/login'

    let response = this.httpClient.post(url, obj);
    return response;
  }


  sendOtp(obj: any) {
    const url = 'http://localhost:8080/api/auth/send-otp'

    let response = this.httpClient.post(url, obj);
    return response;
  }

  verifyOtp(obj: any) {
    const url = 'http://localhost:8080/api/auth/verify-otp'

    let response = this.httpClient.post(url, obj);
    return response;
  }

  forgetPassword(obj: any) {
    const url = 'http://localhost:8080/api/auth/reset-password-mail'

    let response = this.httpClient.post(url, obj);
    return response;
  }




}
