import { Injectable, signal } from '@angular/core';

    @Injectable({ providedIn: 'root' })
    export class LoadingService {
    readonly isLoading = signal(false);
    private count = 0;
    show(): void { this.count++; this.isLoading.set(true); }
    hide(): void { this.count = Math.max(0, this.count - 1); if (this.count === 0) this.isLoading.set(false); }
    }
    