import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { PollService } from '../../../services/poll.service';
import { ToastService } from '../../../services/toast.service';
import { Poll } from '../../../models/poll.model';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-poll-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,

    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule,

    MatButtonToggleModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './poll-list.component.html',
  styleUrl: './poll-list.component.css'
})
export class PollListComponent implements OnInit {

  private pollService = inject(PollService);
  private toast = inject(ToastService);
  public auth = inject(AuthService);

  polls: Poll[] = [];
  filteredPolls: Poll[] = [];

  loading = true;

  selectedFilter: string = 'ALL';
  locationSearch: string = '';

  ngOnInit(): void {
    this.loadPolls();
  }

  loadPolls(): void {

    this.loading = true;

    this.pollService.getAllPolls().subscribe({

      next: (response: any) => {

        if (Array.isArray(response)) {
          this.polls = response;
        }
        else if (response?.content) {
          this.polls = response.content;
        }
        else {
          this.polls = [];
        }

        this.loading = false;
        this.applyFilters();

      },

      error: (error) => {

        console.error(error);

        this.loading = false;

        this.toast.error('Failed to load polls.');

      }

    });

  }

  applyFilters(): void {

    // ---------------------------
    // MY POLLS
    // ---------------------------
    if (this.selectedFilter === 'MINE') {

      this.loading = true;

      this.pollService.getMyPolls().subscribe({

        next: (response: any) => {

          if (Array.isArray(response)) {
            this.filteredPolls = response;
          }
          else if (response?.content) {
            this.filteredPolls = response.content;
          }
          else {
            this.filteredPolls = [];
          }

          // Location Search
          if (this.locationSearch.trim() !== '') {

            this.filteredPolls = this.filteredPolls.filter((poll: any) =>
              (poll.targetLocation || '')
                .toLowerCase()
                .includes(this.locationSearch.toLowerCase())
            );

          }

          this.loading = false;

        },

        error: (error) => {

          console.error(error);

          this.loading = false;

          this.toast.error('Failed to load My Polls.');

        }

      });

      return;

    }

    // ---------------------------
    // ALL / ACTIVE / CLOSED
    // ---------------------------

    let temp = [...this.polls];

    switch (this.selectedFilter) {

      case 'ACTIVE':
        temp = temp.filter((poll: any) =>
          poll.status === 'ACTIVE'
        );
        break;

      case 'CLOSED':
        temp = temp.filter((poll: any) =>
          poll.status === 'CLOSED'
        );
        break;

      case 'ALL':
      default:
        break;

    }

    // ---------------------------
    // LOCATION SEARCH
    // ---------------------------

    if (this.locationSearch.trim() !== '') {

      temp = temp.filter((poll: any) =>
        (poll.targetLocation || '')
          .toLowerCase()
          .includes(this.locationSearch.toLowerCase())
      );

    }

    this.filteredPolls = temp;

  }

  onFilterChange(): void {
    this.applyFilters();
  }

  onLocationSearch(): void {
    this.applyFilters();
  }
deletePoll(id: number): void {

  const confirmDelete = confirm('Are you sure you want to delete this poll?');

  if (!confirmDelete) {
    return;
  }

  this.pollService.deletePoll(id).subscribe({

    next: () => {

      this.toast.success('Poll deleted successfully.');

      this.loadPolls();

    },

    error: (error) => {

      console.error(error);

      this.toast.error('Failed to delete poll.');

    }

  });

}
  refresh(): void {
    this.loadPolls();
  }

}