import { Component, HostListener, signal } from '@angular/core';
    import { RouterOutlet } from '@angular/router';
    import { MatSidenavModule } from '@angular/material/sidenav';
    import { NavbarComponent } from '../navbar/navbar.component';
    import { SidebarComponent } from '../sidebar/sidebar.component';

    @Component({
    selector: 'app-layout',
    standalone: true,
    imports: [RouterOutlet, MatSidenavModule, NavbarComponent, SidebarComponent],
    templateUrl: './layout.component.html',
    styleUrl: './layout.component.css'
    })
export class LayoutComponent {
    isMobile = signal(this.getIsMobile());
    opened = signal(!this.getIsMobile());

    @HostListener('window:resize')
    onResize() {
    const mobile = this.getIsMobile();
    this.isMobile.set(mobile);
    this.opened.set(!mobile);
    }

    toggle() { this.opened.update(v => !v); }

    private getIsMobile(): boolean {
    return typeof window !== 'undefined' && window.innerWidth < 960;
    }
    }
    
