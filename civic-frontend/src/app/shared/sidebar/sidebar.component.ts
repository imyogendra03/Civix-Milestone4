import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterLinkActive } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

import { AuthService } from '../../services/auth.service';

interface NavItem {
  label: string;
  icon: string;
  route: string;
}

const CITIZEN_NAV: NavItem[] = [
  { label: 'Dashboard', icon: 'dashboard', route: '/dashboard' },
  { label: 'Petitions', icon: 'article', route: '/petitions' },
  { label: 'Polls', icon: 'poll', route: '/polls' },
  { label: 'Officials', icon: 'badge', route: '/officials' },
  { label: 'Reports', icon: 'report_problem', route: '/reports' },
  { label: 'Settings', icon: 'settings', route: '/settings' }
];

const ADMIN_NAV: NavItem[] = [
  { label: 'Super Admin', icon: 'admin_panel_settings', route: '/super-admin' }
];

const OFFICIAL_NAV: NavItem[] = [
  { label: 'Dashboard', icon: 'dashboard', route: '/official-dashboard' },
  { label: 'Petitions', icon: 'article', route: '/petitions' },
  { label: 'Polls', icon: 'poll', route: '/polls' },
  { label: 'Community Reports', icon: 'assessment', route: '/reports' },
  { label: 'Officials', icon: 'badge', route: '/officials' },
  { label: 'Settings', icon: 'settings', route: '/settings' }
];

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    RouterLinkActive,
    MatListModule,
    MatIconModule,
    MatDividerModule
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {

  auth = inject(AuthService);

  get user() {
    return this.auth.getUser();
  }

  get navItems(): NavItem[] {

    return this.auth.isSuperAdmin() ? ADMIN_NAV : (this.auth.isOfficial() ? OFFICIAL_NAV : CITIZEN_NAV);

  }

}
