import {inject} from '@angular/core'; import {CanActivateFn,Router} from '@angular/router'; import {AuthService} from '../services/auth.service';
export const adminGuard:CanActivateFn=()=>{const a=inject(AuthService),r=inject(Router);if(a.getUser()?.role==='SUPER_ADMIN')return true;r.navigate(['/dashboard']);return false;};
