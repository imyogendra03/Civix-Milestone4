import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatSelectModule } from '@angular/material/select';

import { FormsModule } from '@angular/forms';

import { AuthService } from '../../services/auth.service';
import { PetitionService } from '../../services/petition.service';
import { ToastService } from '../../services/toast.service';
import { Petition } from '../../models/petition.model';

import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';


@Component({
  selector: 'app-dashboard',
  standalone: true,

  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatSelectModule,
    FormsModule
  ],

  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {

  private auth = inject(AuthService);
  private petitionService = inject(PetitionService);
  private toast = inject(ToastService);
  private http = inject(HttpClient);


  get user() {
    return this.auth.getUser();
  }


  get firstName() {
    return this.user?.name?.split(' ')[0] ?? 'there';
  }


  petitions: Petition[] = [];


  selectedCategory = 'All Categories';


  categories = [
    'All Categories',
    'Environment',
    'Infrastructure',
    'Education',
    'Public Safety',
    'Transportation',
    'Healthcare',
    'Housing'
  ];


  stats = {
    myPetitions: 0,
    signatures: 0,
    votes: 0,
    pollsCreated: 0
  };


  // ============================================================
  // INITIAL LOAD
  // ============================================================

  ngOnInit(): void {
    this.load();
  }


  // ============================================================
  // LOAD DASHBOARD
  // ============================================================

  load(): void {

    this.http
      .get<any>(
        `${environment.apiUrl}/dashboard/citizen`
      )
      .subscribe({

        next: (stats) => {

          this.stats = {
            ...this.stats,
            ...stats
          };

        },

        error: (error) => {

          console.error(
            'Failed to load dashboard statistics:',
            error
          );

          this.toast.error(
            'Failed to load dashboard statistics.'
          );
        }

      });


    this.loadPetitions();
  }


  // ============================================================
  // LOAD PETITIONS
  // ============================================================

  loadPetitions(): void {

    this.petitionService
      .getAllPetitions(0, 10)
      .subscribe({

        next: (response) => {

          this.petitions =
            response.content ?? [];

        },

        error: (error) => {

          console.error(
            'Failed to load petitions:',
            error
          );

          this.petitions = [];

          this.toast.error(
            'Failed to load petitions.'
          );
        }

      });
  }


  // ============================================================
  // CATEGORY FILTER
  // ============================================================

  get displayPetitions(): Petition[] {

    if (
      this.selectedCategory ===
      'All Categories'
    ) {

      return this.petitions;
    }


    return this.petitions.filter(
      petition =>
        petition.category ===
        this.selectedCategory
    );
  }

}