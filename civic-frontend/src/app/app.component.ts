import { Component } from '@angular/core';
    import { RouterOutlet } from '@angular/router';
    import { LoadingSpinnerComponent } from './shared/loading-spinner/loading-spinner.component';
    import { ToastComponent } from './shared/toast/toast.component';

    @Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet, LoadingSpinnerComponent, ToastComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css'
    })
    export class AppComponent { title = 'Civix'; }
    