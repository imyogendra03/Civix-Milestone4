import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';

import { ToastService } from '../../../services/toast.service';


@Component({
  selector: 'app-create-report',
  standalone: true,

  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatRadioModule
  ],

  templateUrl: './create-report.component.html',
  styleUrl: './create-report.component.css'
})
export class CreateReportComponent {

  private fb = inject(FormBuilder);

  private router = inject(Router);

  private toast = inject(ToastService);

  loading = false;


  categories = [
    'Infrastructure',
    'Public Safety',
    'Environment',
    'Transportation',
    'Healthcare',
    'Other'
  ];


  form = this.fb.group({

    title: [
      '',
      [
        Validators.required,
        Validators.minLength(5)
      ]
    ],

    description: [
      '',
      [
        Validators.required,
        Validators.minLength(20)
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

    priority: [
      'MEDIUM',
      Validators.required
    ]

  });


  onSubmit(): void {

    if (this.form.invalid) {

      this.form.markAllAsTouched();

      return;
    }

    /*
     * The current Milestone 4 backend does not provide
     * POST /api/reports or a createReport() API.
     *
     * Therefore this old form cannot currently be
     * submitted to the backend.
     */

    this.toast.error(
      'Report creation is not available in the current backend.'
    );
  }

}