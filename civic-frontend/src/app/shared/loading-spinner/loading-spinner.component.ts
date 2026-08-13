import { Component, inject } from '@angular/core';
    import { CommonModule } from '@angular/common';
    import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
    import { LoadingService } from '../../services/loading.service';

    @Component({
    selector: 'app-loading-spinner',
    standalone: true,
    imports: [CommonModule, MatProgressSpinnerModule],
    templateUrl: './loading-spinner.component.html',
    styleUrl: './loading-spinner.component.css'
    })
    export class LoadingSpinnerComponent { loading = inject(LoadingService); }
    