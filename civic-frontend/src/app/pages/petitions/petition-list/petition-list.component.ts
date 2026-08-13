import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { FormsModule } from '@angular/forms';

import { PetitionService } from '../../../services/petition.service';
import { ToastService } from '../../../services/toast.service';
import { Petition } from '../../../models/petition.model';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-petition-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatPaginatorModule,
    FormsModule
  ],
  templateUrl: './petition-list.component.html',
  styleUrl: './petition-list.component.css'
})
export class PetitionListComponent implements OnInit {

  private petitionService = inject(PetitionService);
  private toast = inject(ToastService);
  public auth = inject(AuthService);

  petitions: Petition[] = [];
  allPetitions: Petition[] = [];

  totalElements = 0;
  page = 0;
  pageSize = 10;

  searchTerm = '';
  selectedCategory = '';
  selectedLocation = '';
  selectedStatus = '';

  // Tabs
  activeTab: 'all' | 'mine' | 'signed' = 'all';

  categories = [
    '',
    'Environment',
    'Infrastructure',
    'Education',
    'Public Safety',
    'Transportation',
    'Healthcare',
    'Housing'
  ];

  ngOnInit(): void {
    this.load();
  }

  load(): void {

    (this.auth.isOfficial()
      ? this.petitionService.getOfficialLocalPetitions(0, 500)
      : this.petitionService.getAllPetitions(0, 500, this.selectedCategory || undefined))
      .subscribe({

        next: (res) => {

          this.allPetitions = res.content;

          this.applyFilters();

        },

        error: () => {

          this.toast.error('Failed to load petitions.');

        }

      });

  }

  changeTab(tab: 'all' | 'mine' | 'signed'): void {

    this.activeTab = tab;

    this.page = 0;

    this.applyFilters();

  }

  applyFilters(): void {

    const term = this.searchTerm.trim().toLowerCase();

    let filtered = this.allPetitions.filter(p =>

      (!this.selectedLocation || p.location === this.selectedLocation) &&

      (!this.selectedStatus || p.status === this.selectedStatus) &&

      (!term ||
        (`${p.title} ${p.description}`)
          .toLowerCase()
          .includes(term))

    );

    // Tab Filters
    if (this.activeTab === 'mine') {

      filtered = filtered.filter(p => p.ownedByCurrentUser);

    }

    if (this.activeTab === 'signed') {

      filtered = filtered.filter(p => p.signedByCurrentUser);

    }

    this.totalElements = filtered.length;

    const start = this.page * this.pageSize;

    this.petitions = filtered.slice(
      start,
      start + this.pageSize
    );

  }

  get locations(): string[] {

    return [
      ...new Set(
        this.allPetitions
          .map(p => p.location)
          .filter(Boolean)
      )
    ].sort();

  }

  onFilterChange(): void {

    this.page = 0;

    this.applyFilters();

  }

  onCategoryChange(): void {

    this.page = 0;

    this.load();

  }

  onPage(event: PageEvent): void {

    this.page = event.pageIndex;

    this.pageSize = event.pageSize;

    this.applyFilters();

  }

  deletePetition(id: number, event: MouseEvent): void {

  event.stopPropagation();

  const confirmed = confirm('Are you sure you want to delete this petition?');

  if (!confirmed) {
    return;
  }

  this.petitionService.deletePetition(id).subscribe({

    next: () => {

      this.toast.success('Petition deleted successfully.');

      this.load();

    },

    error: () => {

      this.toast.error('Failed to delete petition.');

    }

  });

}

}