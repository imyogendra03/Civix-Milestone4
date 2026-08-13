import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AuthService } from '../../../services/auth.service';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-login',
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
    MatProgressSpinnerModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  private toast = inject(ToastService);

  loading = false;
  hidePassword = true;

  form = this.fb.group({

    email: ['', [Validators.required, Validators.email]],

    password: ['', [Validators.required]]

  });

  onSubmit(): void {

    if (this.form.invalid) return;

    this.loading = true;

    this.auth.login({

      email: this.form.value.email!,

      password: this.form.value.password!

    }).subscribe({

      next: (response) => {

  this.loading = false;

  this.toast.success('Login Successful');

  if (response.user.role === 'CITIZEN') {
    this.router.navigate(['/dashboard']);
  } else if (response.user.role === 'SUPER_ADMIN') {
    this.router.navigate(['/super-admin']);
  } else {
    this.router.navigate(['/official-dashboard']);
  }

},

      error: (err) => {

        this.loading = false;

        this.toast.error(

          err.error?.message ||

          err.error?.error ||

          'Invalid Email or Password'

        );

      }

    });

  }

}