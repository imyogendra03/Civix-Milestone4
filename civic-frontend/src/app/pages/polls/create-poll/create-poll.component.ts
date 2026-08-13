import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  FormArray,
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { Router, RouterModule } from '@angular/router';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

import { PollService } from '../../../services/poll.service';
import { ToastService } from '../../../services/toast.service';
import {
  DepartmentService,
  Department
} from '../../../services/department.service';


@Component({
  selector: 'app-create-poll',
  standalone: true,

  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,

    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,

    // Required for mat-select / mat-option
    MatSelectModule,

    MatDatepickerModule,
    MatNativeDateModule
  ],

  templateUrl: './create-poll.component.html',
  styleUrl: './create-poll.component.css'
})
export class CreatePollComponent implements OnInit {

  private fb = inject(FormBuilder);

  private pollService =
    inject(PollService);

  private router =
    inject(Router);

  private toast =
    inject(ToastService);

  private departmentService =
    inject(DepartmentService);


  departments: Department[] = [];

  loading = false;

  minDate = new Date();


  // ============================================================
  // FORM
  // ============================================================

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
      Validators.required
    ],

    department: [
      '',
      Validators.required
    ],

    targetLocation: [
      'Hyderabad',
      Validators.required
    ],

    endDate: [
      '',
      Validators.required
    ],

    options: this.fb.array([

      this.fb.control(
        '',
        Validators.required
      ),

      this.fb.control(
        '',
        Validators.required
      )

    ])

  });


  // ============================================================
  // INIT
  // ============================================================

  ngOnInit(): void {

    this.departmentService
      .getAll()
      .subscribe({

        next: (departments) => {

          this.departments =
            departments;
        },

        error: (error) => {

          console.error(
            'Failed to load departments:',
            error
          );

          this.departments = [];

          this.toast.error(
            'Failed to load departments.'
          );
        }

      });
  }


  // ============================================================
  // OPTIONS
  // ============================================================

  get options(): FormArray {

    return this.form.get(
      'options'
    ) as FormArray;
  }


  addOption(): void {

    this.options.push(
      this.fb.control(
        '',
        Validators.required
      )
    );
  }


  removeOption(index: number): void {

    if (this.options.length > 2) {

      this.options.removeAt(
        index
      );
    }
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


    const value =
      this.form.getRawValue();


    const pollData = {

      title:
        value.title!,

      description:
        value.description!,

      options:
        value.options as string[],

      targetLocation:
        value.targetLocation!,

      department:
        value.department!,

      closeDate:
        new Date(
          value.endDate!
        ).toISOString()
    };


    this.pollService
      .createPoll(pollData)
      .subscribe({

        next: () => {

          this.loading = false;

          this.toast.success(
            'Poll created successfully!'
          );

          this.router.navigate(
            ['/polls']
          );
        },

        error: (error) => {

          this.loading = false;

          console.error(
            'Failed to create poll:',
            error
          );

          this.toast.error(
            error?.error?.message ||
            'Failed to create poll.'
          );
        }

      });
  }

}