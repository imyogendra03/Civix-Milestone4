import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';

import { PetitionService } from '../../../services/petition.service';
import { ToastService } from '../../../services/toast.service';
import { AuthService } from '../../../services/auth.service';
import { Petition } from '../../../models/petition.model';


@Component({
  selector: 'app-petition-detail',
  standalone: true,

  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    MatDividerModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule
  ],

  templateUrl: './petition-detail.component.html',
  styleUrl: './petition-detail.component.css'
})
export class PetitionDetailComponent implements OnInit {

  private route = inject(ActivatedRoute);
  private service = inject(PetitionService);
  private toast = inject(ToastService);
  private auth = inject(AuthService);


  petition: Petition | null = null;

  isOfficial = false;

  signing = false;
  updatingStatus = false;

  selectedStatus: any = 'UNDER_REVIEW';

  comment = '';

  rejectionReason = '';
  proposedSolution = '';

  actionPlan = '';

  responsiblePerson = '';
  responsibleDesignation = '';
  responsibleDepartment = '';

  workStartAt = '';
  expectedCompletionAt = '';

  progressPercent = 0;

  completedWork = '';
  pendingWork = '';
  pendingReason = '';

  responses: any[] = [];
  timeline: any[] = [];
  reviews: any[] = [];

  positivePercentage = 0;

  reviewRating = 5;
  reviewDescription = '';


  // ============================================================
  // INIT
  // ============================================================

  ngOnInit(): void {

    this.isOfficial = this.auth.isOfficial();

    const id = Number(
      this.route.snapshot.paramMap.get('id')
    );

    if (!id) {

      this.toast.error(
        'Invalid petition ID.'
      );

      return;
    }

    this.load(id);
  }


  // ============================================================
  // LOAD PETITION
  // ============================================================

  load(id: number): void {

    this.service
      .getPetitionById(id)
      .subscribe({

        next: (petition) => {

          this.petition = petition;

          this.selectedStatus =
            petition.status;

          this.progressPercent =
            petition.progressPercent ?? 0;

          this.loadExtras(id);
        },

        error: (error) => {

          console.error(
            'Failed to load petition:',
            error
          );

          this.toast.error(
            'Failed to load petition.'
          );
        }

      });
  }


  // ============================================================
  // LOAD RESPONSES / TIMELINE / REVIEWS
  // ============================================================

  loadExtras(id: number): void {

    this.service
      .responses(id)
      .subscribe({

        next: (response) => {

          this.responses =
            response ?? [];
        },

        error: (error) => {

          console.error(
            'Failed to load responses:',
            error
          );
        }

      });


    this.service
      .timeline(id)
      .subscribe({

        next: (response) => {

          this.timeline =
            response?.activities ?? [];
        },

        error: (error) => {

          console.error(
            'Failed to load timeline:',
            error
          );
        }

      });


    this.service
      .reviews(id)
      .subscribe({

        next: (response) => {

          this.reviews =
            response?.reviews ?? [];

          this.positivePercentage =
            response?.positivePercentage ?? 0;
        },

        error: (error) => {

          console.error(
            'Failed to load reviews:',
            error
          );
        }

      });
  }


  // ============================================================
  // SIGN PETITION
  // ============================================================

  get canSign(): boolean {

    return !!this.petition
      && !this.isOfficial
      && !this.petition.signedByCurrentUser
      && this.petition.status !== 'CLOSED';
  }


  sign(): void {

    if (
      !this.petition ||
      !this.canSign
    ) {
      return;
    }

    this.signing = true;

    this.service
      .signPetition(
        this.petition.id
      )
      .subscribe({

        next: () => {

          this.toast.success(
            'You have signed this petition!'
          );

          this.petition!.currentSignatures++;

          this.petition!.signedByCurrentUser =
            true;

          this.signing = false;
        },

        error: (error) => {

          this.signing = false;

          this.toast.error(
            error?.error?.message ||
            'Failed to sign petition.'
          );
        }

      });
  }


  // ============================================================
  // UPDATE PETITION STATUS
  // ============================================================

  updateStatus(): void {

    if (
      !this.petition ||
      !this.isOfficial
    ) {
      return;
    }

    this.decision();
  }


  // ============================================================
  // OFFICIAL DECISION
  // ============================================================

  decision(): void {

    if (!this.petition) {
      return;
    }

    this.updatingStatus = true;

    const payload = {

      status:
        this.selectedStatus,

      comment:
        this.comment,

      rejectionReason:
        this.rejectionReason,

      proposedSolution:
        this.proposedSolution,

      actionPlan:
        this.actionPlan,

      responsiblePerson:
        this.responsiblePerson,

      responsibleDesignation:
        this.responsibleDesignation,

      responsibleDepartment:
        this.responsibleDepartment,

      workStartAt:
        this.workStartAt || null,

      expectedCompletionAt:
        this.expectedCompletionAt || null
    };


    this.service
      .decision(
        this.petition.id,
        payload
      )
      .subscribe({

        next: (updatedPetition) => {

          this.petition =
            updatedPetition;

          this.selectedStatus =
            updatedPetition.status;

          this.progressPercent =
            updatedPetition.progressPercent ?? 0;

          this.toast.success(
            'Petition updated successfully.'
          );

          this.updatingStatus = false;

          this.loadExtras(
            updatedPetition.id
          );
        },

        error: (error) => {

          this.updatingStatus = false;

          this.toast.error(
            error?.error?.message ||
            'Unable to update petition.'
          );
        }

      });
  }


  // ============================================================
  // UPDATE WORK PROGRESS
  // ============================================================

  progress(): void {

    if (!this.petition) {
      return;
    }

    this.service
      .updateProgress(
        this.petition.id,
        {
          progressPercent:
            this.progressPercent,

          completedWork:
            this.completedWork,

          pendingWork:
            this.pendingWork,

          pendingReason:
            this.pendingReason,

          expectedCompletionAt:
            this.expectedCompletionAt || null,

          description:
            this.comment
        }
      )
      .subscribe({

        next: (updatedPetition) => {

          this.petition =
            updatedPetition;

          this.progressPercent =
            updatedPetition.progressPercent ?? 0;

          this.toast.success(
            'Progress updated.'
          );

          this.loadExtras(
            updatedPetition.id
          );
        },

        error: (error) => {

          this.toast.error(
            error?.error?.message ||
            'Progress update failed.'
          );
        }

      });
  }


  // ============================================================
  // COMPLETE WORK
  // ============================================================

  complete(): void {

    if (!this.petition) {
      return;
    }

    this.service
      .complete(
        this.petition.id
      )
      .subscribe({

        next: (updatedPetition) => {

          this.petition =
            updatedPetition;

          this.toast.success(
            'Work marked completed. Citizen review is now open.'
          );

          this.loadExtras(
            updatedPetition.id
          );
        },

        error: (error) => {

          this.toast.error(
            error?.error?.message ||
            'Unable to complete work.'
          );
        }

      });
  }


  // ============================================================
  // CLOSE PETITION
  // ============================================================

  close(): void {

    if (!this.petition) {
      return;
    }

    this.service
      .close(
        this.petition.id
      )
      .subscribe({

        next: (updatedPetition) => {

          this.petition =
            updatedPetition;

          this.toast.success(
            'Petition closed.'
          );

          this.loadExtras(
            updatedPetition.id
          );
        },

        error: (error) => {

          this.toast.error(
            error?.error?.message ||
            'Petition cannot be closed yet.'
          );
        }

      });
  }


  // ============================================================
  // CITIZEN REVIEW
  // ============================================================

  submitReview(): void {

    if (!this.petition) {
      return;
    }

    this.service
      .review(
        this.petition.id,
        {
          rating:
            this.reviewRating,

          description:
            this.reviewDescription
        }
      )
      .subscribe({

        next: () => {

          this.toast.success(
            'Review submitted.'
          );

          this.reviewDescription = '';

          this.loadExtras(
            this.petition!.id
          );
        },

        error: (error) => {

          this.toast.error(
            error?.error?.message ||
            'Unable to submit review.'
          );
        }

      });
  }


  // ============================================================
  // PROGRESS DISPLAY VALUE
  // ============================================================
  //
  // This is intentionally named progressValue because
  // progress() is used by the Save Progress button.
  //
  // ============================================================

  get progressValue(): number {

    if (!this.petition) {
      return 0;
    }

    if (
      this.petition.progressPercent != null
    ) {
      return this.petition.progressPercent;
    }

    if (
      this.petition.goal &&
      this.petition.goal > 0
    ) {

      return Math.min(

        (
          this.petition.currentSignatures /
          this.petition.goal
        ) * 100,

        100
      );
    }

    return 0;
  }

}