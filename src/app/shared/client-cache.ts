// src/app/shared/client-cache.ts
import { BehaviorSubject } from 'rxjs';

export class ClientCache {
  // Reactive client list shared across app
  static clients$ = new BehaviorSubject<any[]>([]);
  
  // Flag to check if backend was already loaded
  static loaded = false;

  // Update the cache with new clients
  static setClients(clients: any[]) {
    this.clients$.next(clients);
    this.loaded = true;
  }
}
