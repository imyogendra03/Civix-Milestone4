import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { PollService } from '../../../services/poll.service';
import { ToastService } from '../../../services/toast.service';

import { Poll } from '../../../models/poll.model';

@Component({
  selector: 'app-vote-poll',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatRadioModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './vote-poll.component.html',
  styleUrl: './vote-poll.component.css'
})
export class VotePollComponent implements OnInit {

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private pollService = inject(PollService);
  private toast = inject(ToastService);

  poll: Poll | null = null;
  selectedOption = '';
  submitting = false;
  loading = true;

  // NEW
  hasVoted = false;

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadPoll(id);
  }

  loadPoll(id: number): void {
    this.loading = true;

    this.pollService.getPollById(id).subscribe({
      next: (response: any) => {
        console.log('Poll:', response);

       this.poll = response;
this.loading = false;
      },
      error: (error) => {
        console.error('Load Poll Error:', error);
        this.loading = false;
        this.toast.error('Failed to load poll.');
      }
    });
  }
vote(): void {

  if (this.hasVoted) {
    this.toast.info('You have already voted.');
    return;
  }

  if (!this.poll || !this.selectedOption) {
    this.toast.error('Please select an option.');
    return;
  }

  this.submitting = true;

  const voteRequest = {
    selectedOption: this.selectedOption
  };

  this.pollService.votePoll(this.poll.id, voteRequest).subscribe({

    next: () => {

      this.submitting = false;

      this.hasVoted = true;
      this.selectedOption = '';

      this.toast.success('Your vote has been submitted successfully.');

      // Stay on this page
      // this.router.navigate(['/polls', this.poll!.id, 'results']);
    },

    error: (error) => {

      this.submitting = false;

      if (
        error.status === 409 ||
        error.error?.message === 'You have already voted.'
      ) {
        this.hasVoted = true;
        this.toast.info('You have already voted.');
        return;
      }

      this.toast.error('Failed to submit your vote.');
    }

  });

}
}