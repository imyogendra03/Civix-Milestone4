import { Component, inject } from '@angular/core';
    import { CommonModule } from '@angular/common';
    import { MatIconModule } from '@angular/material/icon';
    import { ToastService } from '../../services/toast.service';

    @Component({
    selector: 'app-toast',
    standalone: true,
    imports: [CommonModule, MatIconModule],
    templateUrl: './toast.component.html',
    styleUrl: './toast.component.css'
    })
    export class ToastComponent { toast = inject(ToastService); }
    