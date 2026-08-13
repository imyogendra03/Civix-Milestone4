import { Injectable, signal } from '@angular/core';

    export interface Toast { message: string; type: 'success' | 'error' | 'info' | 'warning'; id: number; }

    @Injectable({ providedIn: 'root' })
    export class ToastService {
    readonly toasts = signal<Toast[]>([]);
    private nextId = 0;

    show(message: string, type: Toast['type'] = 'info', duration = 3500): void {
      const id = this.nextId++;
      this.toasts.update(t => [...t, { message, type, id }]);
      setTimeout(() => this.remove(id), duration);
    }

    success(msg: string) { this.show(msg, 'success'); }
    error(msg: string)   { this.show(msg, 'error'); }
    info(msg: string)    { this.show(msg, 'info'); }
    warning(msg: string) { this.show(msg, 'warning'); }
    remove(id: number): void { this.toasts.update(t => t.filter(x => x.id !== id)); }
    }
    