import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterLink, MatButtonModule, MatIconModule, MatMenuModule, MatDividerModule],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css'
})
export class LandingComponent {
  auth = inject(AuthService);

  get user() { return this.auth.getUser(); }
  get dashboardRoute(): string { return this.auth.isOfficial() ? '/official-dashboard' : '/dashboard'; }
  get firstName(): string { return this.user?.name?.split(' ')[0] || 'User'; }
}
