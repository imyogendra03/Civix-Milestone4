import { Component, inject, OnInit } from '@angular/core';
    import { CommonModule } from '@angular/common';
    import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
    import { Router, RouterModule } from '@angular/router';
    import { MatFormFieldModule } from '@angular/material/form-field';
    import { MatInputModule } from '@angular/material/input';
    import { MatButtonModule } from '@angular/material/button';
    import { MatIconModule } from '@angular/material/icon';
    import { MatSelectModule } from '@angular/material/select';
    import { MatCardModule } from '@angular/material/card';
    import { PetitionService } from '../../../services/petition.service';
    import { ToastService } from '../../../services/toast.service';
import { DepartmentService, Department } from '../../../services/department.service';

    @Component({
    selector: 'app-create-petition',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatSelectModule, MatCardModule],
    templateUrl: './create-petition.component.html',
    styleUrl: './create-petition.component.css'
    })
    export class CreatePetitionComponent implements OnInit {
    private fb = inject(FormBuilder);
    private petitionService = inject(PetitionService);
    private router = inject(Router);
    private toast = inject(ToastService);
    private departmentService = inject(DepartmentService);
    departments: Department[] = [];

    loading = false;
    categories = ['Environment', 'Infrastructure', 'Education', 'Public Safety', 'Transportation', 'Healthcare', 'Housing', 'Other'];

    ngOnInit(): void { this.departmentService.getAll().subscribe({next: d => this.departments=d}); }

    form = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(10)]],
      description: ['', [Validators.required, Validators.minLength(50)]],
      category: ['', Validators.required],
      department: ['', Validators.required],
      location: ['', Validators.required],
      goal: [1000, [Validators.required, Validators.min(10)]]
    });

    onSubmit(): void {
      if (this.form.invalid) return;
      this.loading = true;
      const v = this.form.value;
      this.petitionService.createPetition({
        title: v.title!, description: v.description!, category: v.category!, location: v.location!, department: v.department!, goal: v.goal!
      }).subscribe({
        next: (p) => { this.toast.success('Petition created successfully!'); this.router.navigate(['/petitions', p.id]); },
        error: (err) => {
  this.loading = false;

  console.error('CREATE PETITION ERROR:', err);
  console.error('STATUS:', err.status);
  console.error('ERROR BODY:', err.error);

  this.toast.error(
    err?.error?.message ||
    err?.error?.error ||
    'Failed to create petition.'
  );
},
        complete: () => { this.loading = false; }
      });
    }
    }
    