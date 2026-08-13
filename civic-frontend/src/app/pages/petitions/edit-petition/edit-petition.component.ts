import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';
import {
  Router,
  ActivatedRoute,
  RouterModule
} from '@angular/router';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';

import { PetitionService } from '../../../services/petition.service';
import { ToastService } from '../../../services/toast.service';


@Component({
  selector: 'app-edit-petition',
  standalone: true,

  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule
  ],

  templateUrl: './edit-petition.component.html',
  styleUrl: './edit-petition.component.css'
})
export class EditPetitionComponent implements OnInit {

  private fb = inject(FormBuilder);
  private petitionService = inject(PetitionService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private toast = inject(ToastService);

  petitionId = 0;

  loading = false;

  // Existing UI categories preserved
  categories = [
    'Environment',
    'Infrastructure',
    'Education',
    'Public Safety',
    'Transportation',
    'Healthcare',
    'Housing',
    'Other'
  ];

  // Department is deliberately NOT added to the form.
  // Existing petition department will be preserved.
  private petitionDepartment = '';

  form = this.fb.group({
    title: [
      '',
      [
        Validators.required,
        Validators.minLength(10)
      ]
    ],

    description: [
      '',
      [
        Validators.required,
        Validators.minLength(50)
      ]
    ],

    category: [
      '',
      Validators.required
    ],

    location: [
      '',
      Validators.required
    ],

    goal: [
      1000,
      [
        Validators.required,
        Validators.min(10)
      ]
    ]
  });


  // ============================================================
  // INIT
  // ============================================================

  ngOnInit(): void {

    this.petitionId = Number(
      this.route.snapshot.paramMap.get('id')
    );

    if (!this.petitionId) {
      this.toast.error(
        'Invalid petition ID.'
      );
      return;
    }

    this.petitionService
      .getPetitionById(this.petitionId)
      .subscribe({

        next: (petition) => {

          // Preserve the existing department.
          this.petitionDepartment =
            petition.department ?? '';

          // Existing UI fields only.
          this.form.patchValue({
            title: petition.title,
            description: petition.description,
            category: petition.category,
            location: petition.location,
            goal: petition.goal
          });
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
  // SUBMIT
  // ============================================================

  onSubmit(): void {

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;

    const raw =
      this.form.getRawValue();


    const payload = {

      title: raw.title!,

      description:
        raw.description!,

      category:
        raw.category!,

      location:
        raw.location!,

      // Required by UpdatePetitionRequest.
      // Existing department is preserved.
      department:
        this.petitionDepartment,

      goal:
        raw.goal!
    };


    this.petitionService
      .updatePetition(
        this.petitionId,
        payload
      )
      .subscribe({

        next: () => {

          this.toast.success(
            'Petition updated!'
          );

          this.router.navigate([
            '/petitions',
            this.petitionId
          ]);
        },

        error: (error) => {

          console.error(
            'Failed to update petition:',
            error
          );

          this.loading = false;

          this.toast.error(
            error?.error?.message ||
            'Failed to update.'
          );
        }

      });
  }
}