import { Component, OnInit } from '@angular/core';
import { Client } from '../../models/client.model';
import { ExistingClientService } from '../../services/existing-client.service';

@Component({
  selector: 'app-existing-clients',
  templateUrl: './existing-clients.component.html',
  styleUrls: ['./existing-clients.component.css']
})
export class ExistingClientsComponent implements OnInit {
  clients: Client[] = [];
  selectedClientId: number | null = null;
  showDeleteModal = false;
  editMode = false;

  editedClient: Client | null = null;
  editDataForClient: { id: number | undefined } | null = null;

  constructor(private existingClientService: ExistingClientService) { }

  ngOnInit(): void {
    this.fetchClients();
  }

  fetchClients(): void {
    this.existingClientService.getAllClients().subscribe({
      next: (data) => {
        this.clients = data;
        this.editDataForClient = null; // ✅ Disable sales edit mode
        this.editMode = false;         // ✅ Disable client edit mode
      },
      error: (err) => console.error('Failed to fetch clients:', err)
    });
  }

  get selectedClient(): Client | undefined {
    return this.clients.find(c => c.id === this.selectedClientId!);
  }

  onClientSelect(): void {
    this.editMode = false;
    if (this.selectedClient) {
      this.editedClient = { ...this.selectedClient };
    }
  }

  enableEdit(): void {
    this.editMode = true;
  }

  saveClient(): void {
    if (!this.selectedClient || !this.editedClient) return;

    this.existingClientService.updateClient(this.selectedClient.id, this.editedClient).subscribe({
      next: () => {
        this.fetchClients(); // ✅ Reloads data and disables edit
      },
      error: (err) => {
        console.error('Error updating client:', err);
        alert('Failed to update client.');
      }
    });
  }

  openDeleteModal(): void {
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
  }

  confirmDelete(): void {
    if (this.selectedClientId != null) {
      this.existingClientService.deleteClient(this.selectedClientId).subscribe({
        next: () => {
          this.selectedClientId = null;
          this.editMode = false;
          this.editedClient = null;
          this.showDeleteModal = false;
          this.fetchClients(); // ✅ Resets edit states
        },
        error: (err) => {
          console.error('Failed to delete client:', err);
          alert('Failed to delete client.');
          this.showDeleteModal = false;
        }
      });
    }
  }

  confirmEditSales(data: any): void {
    if (data.saleDateTime && typeof data.saleDateTime === 'string' && !data.saleDateTime.includes('T')) {
      data.saleDateTime += 'T00:00:00';
    }

    this.existingClientService.confirmEditSales(data.id, data).subscribe({
      next: () => {
        this.fetchClients(); // ✅ Reset edit after reload
      },
      error: (err) => console.error('Failed to edit sales:', err)
    });
  }

 confirmDeleteSales(data: any): void {
  this.existingClientService.confirmDeleteSales(data.id).subscribe({
    next: () => {
      if (this.selectedClientId != null) {
        this.existingClientService.getClientById(this.selectedClientId).subscribe({
          next: (updatedClient) => {
            const index = this.clients.findIndex(c => c.id === this.selectedClientId);
            if (index !== -1) {
              this.clients[index] = updatedClient;
              this.editedClient = { ...updatedClient };
            }
          },
          error: (err) => {
            console.error('Failed to refresh selected client:', err);
          }
        });
      }
    },
    error: (err) => {
      console.error('Failed to delete sales:', err);
    }
  });
}

}
