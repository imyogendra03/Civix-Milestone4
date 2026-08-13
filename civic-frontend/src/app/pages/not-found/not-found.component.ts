import { Component } from '@angular/core';
    import { RouterModule } from '@angular/router';
    import { MatButtonModule } from '@angular/material/button';
    import { MatIconModule } from '@angular/material/icon';

    @Component({
    selector: 'app-not-found',
    standalone: true,
    imports: [RouterModule, MatButtonModule, MatIconModule],
    templateUrl: './not-found.component.html',
    styleUrl: './not-found.component.css'
    })
    export class NotFoundComponent {}
    