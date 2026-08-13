import { Component, inject, OnInit } from '@angular/core';
    import { CommonModule } from '@angular/common';
    import { RouterModule } from '@angular/router';
    import { MatCardModule } from '@angular/material/card';
    import { MatButtonModule } from '@angular/material/button';
    import { MatIconModule } from '@angular/material/icon';
    import { MatInputModule } from '@angular/material/input';
    import { MatFormFieldModule } from '@angular/material/form-field';
    import { FormsModule } from '@angular/forms';
    import { OfficialService } from '../../../services/official.service';
    import { ToastService } from '../../../services/toast.service';
    import { Official } from '../../../models/official.model';

    @Component({
    selector: 'app-officials-list',
    standalone: true,
    imports: [CommonModule, RouterModule, MatCardModule, MatButtonModule, MatIconModule, MatInputModule, MatFormFieldModule, FormsModule],
    templateUrl: './officials-list.component.html',
    styleUrl: './officials-list.component.css'
    })
    export class OfficialsListComponent implements OnInit {
    private officialService = inject(OfficialService);
    private toast = inject(ToastService);
    officials: Official[] = [];
    search = '';

    ngOnInit(): void { this.load(); }

    load(): void {
      this.officialService.getOfficials(0, 20, this.search || undefined).subscribe({
        next: (res) => { this.officials = res.content; },
        error: () => this.toast.error('Failed to load officials.')
      });
    }
    }
    