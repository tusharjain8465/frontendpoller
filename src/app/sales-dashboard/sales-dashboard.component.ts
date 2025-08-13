import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-sales-dashboard',
  templateUrl: './sales-dashboard.component.html',
  styleUrls: ['./sales-dashboard.component.css']
})
export class SalesDashboardComponent implements OnInit {
  chart: any;
  currentPeriod: 'today' | 'week' | 'month' = 'today';
  labels: string[] = [];
  salesData: number[] = [];
  profitData: number[] = [];

  averageSale = 0;
  averageProfit = 0;
  highestSale = 0;
  highestProfit = 0;

  private apiUrl = 'http://localhost:8080/api/sales/graph-data';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchDataFromApi();
  }

  onPeriodChange(period: 'today' | 'week' | 'month') {
    this.currentPeriod = period;
    this.fetchDataFromApi();
  }

  fetchDataFromApi() {
    this.http.get<any>(`${this.apiUrl}?period=${this.currentPeriod}`).subscribe({
      next: (res) => {
        this.labels = res.labels;
        this.salesData = res.salesData;
        this.profitData = res.profitData;

        this.averageSale = res.averageSale;
        this.averageProfit = res.averageProfit;
        this.highestSale = res.highestSale;
        this.highestProfit = res.highestProfit;

        if (!this.chart) {
          this.createChart();
        } else {
          this.updateChart();
        }
      },
      error: (err) => {
        console.error('Error fetching sales data:', err);
      }
    });
  }

  createChart() {
    this.chart = new Chart('salesChart', {
      type: 'bar',
      data: {
        labels: this.labels,
        datasets: [
          {
            label: 'Total Sale (₹)',
            data: this.salesData,
            backgroundColor: '#003366', // Dark blue for sales
            barPercentage: 0.6,
            categoryPercentage: 0.6
          },
          {
            label: 'Total Profit (₹)',
            data: this.profitData,
            backgroundColor: '#006400', // Dark green for profit
            barPercentage: 0.6,
            categoryPercentage: 0.6
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'top' },
          tooltip: {
            callbacks: {
              label: (context) => {
                const value = Number(context.parsed.y) || 0;
                return `₹${value.toLocaleString()}`;
              }
            }
          }
        },
        scales: {
          x: { beginAtZero: true },
          y: {
            beginAtZero: true,
            ticks: {
              callback: (value) => {
                const numValue = Number(value);
                if (numValue >= 100000) {
                  return `₹${(numValue / 100000).toFixed(1)}L`;
                } else if (numValue >= 1000) {
                  return `₹${(numValue / 1000).toFixed(1)}K`;
                }
                return `₹${numValue}`;
              }
            }
          }
        }
      }
    });
  }

  updateChart() {
    this.chart.data.labels = this.labels;
    this.chart.data.datasets[0].data = this.salesData;
    this.chart.data.datasets[1].data = this.profitData;
    this.chart.update();
  }
}
