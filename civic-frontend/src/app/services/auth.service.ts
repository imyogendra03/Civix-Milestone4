import {Injectable,inject} from '@angular/core'; import {HttpClient} from '@angular/common/http'; import {Observable,tap} from 'rxjs'; import {Router} from '@angular/router'; import {environment} from '../../environments/environment'; import {LoginRequest,LoginResponse,RegisterRequest,RegisterResponse,User} from '../models/user.model';
@Injectable({providedIn:'root'}) export class AuthService {private http=inject(HttpClient);private router=inject(Router);private API=environment.apiUrl+'/auth';private TOKEN_KEY='token';private USER_KEY='loggedUser';
 register(d:RegisterRequest):Observable<RegisterResponse>{return this.http.post<RegisterResponse>(`${this.API}/register`,d);}
 login(c:LoginRequest):Observable<LoginResponse>{return this.http.post<LoginResponse>(`${this.API}/login`,c).pipe(tap(r=>{localStorage.setItem(this.TOKEN_KEY,r.token);localStorage.setItem(this.USER_KEY,JSON.stringify(r.user));}));}
 getCurrentUser():Observable<User>{return this.http.get<User>(`${this.API}/me`).pipe(tap(u=>localStorage.setItem(this.USER_KEY,JSON.stringify(u))));}
 updateProfile(d:{name:string;email:string;location:string}):Observable<User>{return this.http.put<User>(`${this.API}/profile`,d).pipe(tap(u=>localStorage.setItem(this.USER_KEY,JSON.stringify(u))));}
 changePassword(d:{currentPassword:string;newPassword:string;confirmPassword:string}):Observable<void>{return this.http.put<void>(`${this.API}/password`,d);}
 logout(){localStorage.removeItem(this.TOKEN_KEY);localStorage.removeItem(this.USER_KEY);this.router.navigate(['/auth/login']);}
 getToken(){const t=localStorage.getItem(this.TOKEN_KEY);return t&&t!=='undefined'&&t!=='null'?t:null;}
 getUser():User|null{const u=localStorage.getItem(this.USER_KEY);if(!u)return null;try{return JSON.parse(u);}catch{localStorage.removeItem(this.USER_KEY);return null;}}
 isLoggedIn(){return !!this.getToken();} isOfficial(){return this.getUser()?.role==='OFFICIAL';} isSuperAdmin(){return this.getUser()?.role==='SUPER_ADMIN';}
}
