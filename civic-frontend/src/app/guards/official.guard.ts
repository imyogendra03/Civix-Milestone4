import {inject} from '@angular/core'; import {CanActivateFn,Router} from '@angular/router'; import {AuthService} from '../services/auth.service';
export const officialGuard:CanActivateFn=()=>{const a=inject(AuthService),r=inject(Router);const u=a.getUser();if(u?.role==='OFFICIAL'&&u.verified&&u.active)return true;r.navigate([u?.role==='SUPER_ADMIN'?'/super-admin':'/dashboard']);return false;};
