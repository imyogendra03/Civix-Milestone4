import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  inject
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';

import { Chart, registerables } from 'chart.js';
import { PollService } from '../../../services/poll.service';
import { ToastService } from '../../../services/toast.service';
import {
  PollDashboardStats,
  PollResponse,
  PollResultResponse
} from '../../../models/poll.model';

Chart.register(...registerables);

@Component({
  selector: 'app-poll-results',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatSelectModule
  ],
  templateUrl: './poll-results.component.html',
  styleUrl: './poll-results.component.css'
})
export class PollResultsComponent implements OnInit, OnDestroy {
  private pollService = inject(PollService);
  private toast = inject(ToastService);
  private route = inject(ActivatedRoute);

  @ViewChild('barCanvas') barCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('pieCanvas') pieCanvas!: ElementRef<HTMLCanvasElement>;

  stats: PollDashboardStats | null = null;
  polls: PollResponse[] = [];
  pollResult: PollResultResponse | null = null;
  selectedPollId: number | null = null;

  isLoading = false;
  errorMsg = '';

  private barChart: Chart | null = null;
  private pieChart: Chart | null = null;
  private refreshTimer?: ReturnType<typeof setInterval>;

  ngOnInit(): void {
    this.loadStats();
    this.loadPollsList();

    // Auto-refresh results every 10 seconds; browser refresh not needed.
    this.refreshTimer = setInterval(() => {
      this.loadStats();
      this.refreshSelectedPoll();
    }, 10000);
  }

  ngOnDestroy(): void {
    this.destroyCharts();

    if (this.refreshTimer) {
      clearInterval(this.refreshTimer);
    }
  }

  loadStats(): void {
    this.pollService.getDashboardStats().subscribe({
      next: data => this.stats = data
    });
  }

  loadPollsList(): void {
    this.isLoading = true;
    this.errorMsg = '';

    this.pollService.getAllPolls().subscribe({
      next: polls => {
        this.polls = polls;
        this.isLoading = false;

        const routePollId = Number(this.route.snapshot.paramMap.get('id'));

        if (routePollId && polls.some(poll => poll.id === routePollId)) {
          this.selectedPollId = routePollId;
        } else if (!this.selectedPollId && polls.length > 0) {
          this.selectedPollId = polls[0].id;
        }

        if (this.selectedPollId) {
          this.onPollSelect(this.selectedPollId);
        }
      },
      error: () => {
        this.isLoading = false;
        this.errorMsg = 'Failed to load polls.';
        this.toast.error('Failed to load polls.');
      }
    });
  }

  onPollSelect(id: number): void {
    this.selectedPollId = id;
    this.isLoading = true;

    this.pollService.getPollResults(id).subscribe({
      next: data => {
        this.pollResult = data;
        this.isLoading = false;
        this.loadStats();

        setTimeout(() => this.renderCharts(), 0);
      },
      error: () => {
        this.isLoading = false;
        this.toast.error('Unable to load poll results.');
      }
    });
  }

  refreshSelectedPoll(): void {
    if (!this.selectedPollId) {
      return;
    }

    this.pollService.getPollResults(this.selectedPollId).subscribe({
      next: data => {
        this.pollResult = data;

        setTimeout(() => this.renderCharts(), 0);
      }
    });
  }

  private destroyCharts(): void {
    this.barChart?.destroy();
    this.pieChart?.destroy();

    this.barChart = null;
    this.pieChart = null;
  }

  private renderCharts(): void {
    this.destroyCharts();

    if (!this.pollResult?.results?.length) {
      return;
    }

    const labels = this.pollResult.results.map(item => item.option);
    const votes = this.pollResult.results.map(item => item.votes);

    const colors = [
      '#2563eb',
      '#16a34a',
      '#f97316',
      '#8b5cf6',
      '#dc2626',
      '#0891b2',
      '#db2777',
      '#ca8a04'
    ];

    const barContext = this.barCanvas?.nativeElement.getContext('2d');

    if (barContext) {
      this.barChart = new Chart(barContext, {
        type: 'bar',
        data: {
          labels,
          datasets: [{
            label: 'Votes',
            data: votes,
            backgroundColor: colors.slice(0, labels.length),
            borderRadius: 8,
            borderSkipped: false
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: { stepSize: 1 }
            },
            x: {
              grid: { display: false }
            }
          }
        }
      });
    }

    const pieContext = this.pieCanvas?.nativeElement.getContext('2d');

    if (pieContext) {
      this.pieChart = new Chart(pieContext, {
        type: 'doughnut',
        data: {
          labels,
          datasets: [{
            data: votes,
            backgroundColor: colors.slice(0, labels.length),
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '62%',
          plugins: {
            legend: {
              position: 'bottom'
            }
          }
        }
      });
    }
  }
}