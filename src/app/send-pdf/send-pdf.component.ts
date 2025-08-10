import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { HttpClient, HttpParams } from '@angular/common/http';
import { formatDate } from '@angular/common';
import { environment } from '../../environments/environment';  // import environment

@Component({
  selector: 'app-send-pdf',
  templateUrl: './send-pdf.component.html',
  styleUrls: ['./send-pdf.component.css']
})
export class SendPdfComponent implements OnInit {
  clients: any[] = [];

  filters = {
    client: '',
    useDateRange: false,
    startDate: '',
    endDate: '',
    days: 0,
    useDeposit: false,
    depositAmount: 0,
    oldBalance: 0,
    depositDatetime: ''
  };

  isGenerating = false;
  previewUrl: SafeResourceUrl | null = null;
  toastMsg: string = '';

  private clientBaseUrl = `${environment.apiBaseUrl}/api/clients`;
  private pdfBaseUrl = `${environment.apiBaseUrl}/api/pdf`;

  constructor(private sanitizer: DomSanitizer, private http: HttpClient) {}

  ngOnInit(): void {
    this.getClients();
  }

  getClients() {
    this.http.get<any[]>(`${this.clientBaseUrl}/all`)
      .subscribe({
        next: (res) => this.clients = res,
        error: (err) => console.error('Failed to fetch clients:', err)
      });
  }

  onSubmit() {
    this.isGenerating = true;
    this.toastMsg = '';
    this.previewUrl = null;

    let params = new HttpParams();

    if (this.filters.client) {
      params = params.set('clientId', this.filters.client.toString());
    }

    if (this.filters.useDateRange) {
      if (this.filters.startDate) {
        params = params.set('from', this.filters.startDate + ' 00:00:00');
      }
      if (this.filters.endDate) {
        params = params.set('to', this.filters.endDate + ' 23:59:59');
      }
    } else if (this.filters.days > 0) {
      params = params.set('days', this.filters.days.toString());
    }

    if (this.filters.useDeposit) {
      if (this.filters.depositAmount > 0) {
        params = params.set('depositAmount', this.filters.depositAmount.toString());
      }

      if (this.filters.depositDatetime) {
        const formatted = formatDate(this.filters.depositDatetime, 'yyyy-MM-dd HH:mm:ss', 'en-IN');
        params = params.set('depositDatetime', formatted);
      }
    }

    if (this.filters.oldBalance > 0) {
      params = params.set('oldBalance', this.filters.oldBalance.toString());
    }

    this.http.get(`${this.pdfBaseUrl}/sales`, {
      params,
      responseType: 'blob'
    }).subscribe({
      next: (blob: Blob) => {
        const blobUrl = URL.createObjectURL(blob);
        this.previewUrl = this.sanitizer.bypassSecurityTrustResourceUrl(blobUrl);
        this.toastMsg = '✅ PDF generated successfully!';
        this.isGenerating = false;
        setTimeout(() => this.toastMsg = '', 3000);
      },
      error: (err) => {
        this.toastMsg = '❌ Failed to generate PDF.';
        console.error(err);
        this.isGenerating = false;
      }
    });
  }
}
