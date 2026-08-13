import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { officialGuard } from './guards/official.guard';
import { adminGuard } from './guards/admin.guard';
import { LayoutComponent } from './shared/layout/layout.component';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/landing/landing.component').then(m => m.LandingComponent) },
  {
    path: 'auth',
    children: [
      { path: 'login', loadComponent: () => import('./pages/auth/login/login.component').then(m => m.LoginComponent) },
      { path: 'register', loadComponent: () => import('./pages/auth/register/register.component').then(m => m.RegisterComponent) },
      { path: '', redirectTo: 'login', pathMatch: 'full' }
    ]
  },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent) },
      { path: 'official-dashboard', canActivate: [officialGuard], loadComponent: () => import('./pages/official-dashboard/official-dashboard.component').then(m => m.OfficialDashboardComponent) },
      { path: 'super-admin', canActivate: [adminGuard], loadComponent: () => import('./pages/super-admin/super-admin.component').then(m => m.SuperAdminComponent) },
      {
        path: 'petitions',
        children: [
          { path: '', loadComponent: () => import('./pages/petitions/petition-list/petition-list.component').then(m => m.PetitionListComponent) },
          { path: 'create', loadComponent: () => import('./pages/petitions/create-petition/create-petition.component').then(m => m.CreatePetitionComponent) },
          { path: ':id', loadComponent: () => import('./pages/petitions/petition-detail/petition-detail.component').then(m => m.PetitionDetailComponent) },
          { path: ':id/edit', loadComponent: () => import('./pages/petitions/edit-petition/edit-petition.component').then(m => m.EditPetitionComponent) }
        ]
      },
      {
        path: 'polls',
        children: [
          { path: '', loadComponent: () => import('./pages/polls/poll-list/poll-list.component').then(m => m.PollListComponent) },
          { path: 'create', loadComponent: () => import('./pages/polls/create-poll/create-poll.component').then(m => m.CreatePollComponent) },
          { path: 'results', loadComponent: () => import('./pages/polls/poll-results/poll-results.component').then(m => m.PollResultsComponent) },
          { path: ':id/vote', loadComponent: () => import('./pages/polls/vote-poll/vote-poll.component').then(m => m.VotePollComponent) },
          { path: ':id/results', loadComponent: () => import('./pages/polls/poll-results/poll-results.component').then(m => m.PollResultsComponent) }
        ]
      },
      {
        path: 'officials',
        children: [
          { path: '', loadComponent: () => import('./pages/officials/officials-list/officials-list.component').then(m => m.OfficialsListComponent) },
          { path: ':id', loadComponent: () => import('./pages/officials/official-profile/official-profile.component').then(m => m.OfficialProfileComponent) }
        ]
      },
      {
        path: 'reports',
        children: [
          { path: '', loadComponent: () => import('./pages/reports/report-list/report-list.component').then(m => m.ReportListComponent) },
          { path: 'create', loadComponent: () => import('./pages/reports/create-report/create-report.component').then(m => m.CreateReportComponent) }
        ]
      },
      { path: 'settings', loadComponent: () => import('./pages/settings/settings.component').then(m => m.SettingsComponent) }
    ]
  },
  { path: '**', loadComponent: () => import('./pages/not-found/not-found.component').then(m => m.NotFoundComponent) }
];
