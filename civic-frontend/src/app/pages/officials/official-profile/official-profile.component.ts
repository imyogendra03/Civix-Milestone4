import { Component, inject, OnInit } from '@angular/core';
    import { CommonModule } from '@angular/common';
    import { RouterModule, ActivatedRoute } from '@angular/router';
    import { MatCardModule } from '@angular/material/card';
    import { MatButtonModule } from '@angular/material/button';
    import { MatIconModule } from '@angular/material/icon';
    import { MatDividerModule } from '@angular/material/divider';
    import { OfficialService } from '../../../services/official.service';
    import { ToastService } from '../../../services/toast.service';
    import { Official } from '../../../models/official.model';

    @Component({
    selector: 'app-official-profile',
    standalone: true,
    imports: [CommonModule, RouterModule, MatCardModule, MatButtonModule, MatIconModule, MatDividerModule],
    templateUrl: './official-profile.component.html',
    styleUrl: './official-profile.component.css'
    })
    export class OfficialProfileComponent implements OnInit {
    private route = inject(ActivatedRoute);
    private officialService = inject(OfficialService);
    private toast = inject(ToastService);
    official: Official | null = null;

    ngOnInit(): void {
      const id = Number(this.route.snapshot.paramMap.get('id'));
      this.officialService.getOfficialById(id).subscribe({
        next: (o) => { this.official = o; },
        error: () => this.toast.error('Failed to load official profile.')
      });
    }
    }
    