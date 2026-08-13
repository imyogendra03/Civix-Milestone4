import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AuthService } from '../../../services/auth.service';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatRadioModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  private toast = inject(ToastService);

  loading = false;
  hidePassword = true;

  form = this.fb.group({

    name: [
      '',
      [
        Validators.required,
        Validators.minLength(3)
      ]
    ],

    email: [
      '',
      [
        Validators.required,
        Validators.pattern(
          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        )
      ]
    ],

    password: [
      '',
      [
        Validators.required,
        Validators.pattern(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^#()_+\-=\[\]{};':"\\|,.<>/?]).{6,}$/
        )
      ]
    ],

    location: [
      '',
      [
        Validators.required
      ]
    ],

    designation: [''],

    role: [
      'CITIZEN',
      [Validators.required]
    ]

  });

  onSubmit(): void {

    if (this.form.invalid) {

      this.form.markAllAsTouched();

      return;

    }

    this.loading = true;

    this.auth.register({

      name: this.form.value.name!,

      email: this.form.value.email!,

      password: this.form.value.password!,

      location: this.form.value.location!,

      role: this.form.value.role as 'CITIZEN' | 'OFFICIAL',
      designation: this.form.value.designation || undefined

    }).subscribe({

      next: () => {

        this.loading = false;

        this.toast.success(this.form.value.role === 'OFFICIAL' ? 'Official registration submitted. Wait for Super Admin verification.' : 'Registration Successful');

        this.router.navigate(['/auth/login']);

      },

      error: (err) => {

        this.loading = false;

        this.toast.error(

          err.error?.message ||

          err.error?.error ||

          'Registration Failed'

        );

      }

    });

  }

}