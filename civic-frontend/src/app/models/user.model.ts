export type Role = 'CITIZEN' | 'OFFICIAL' | 'SUPER_ADMIN';
export interface User { id:number; name:string; email:string; role:Role; location:string; department?:string; designation?:string; verified:boolean; active:boolean; }
export interface LoginRequest {email:string;password:string;}
export interface LoginResponse {token:string;user:User;}
export interface RegisterRequest {name:string;email:string;password:string;role:'CITIZEN'|'OFFICIAL';location:string;department?:string;designation?:string;}
export interface RegisterResponse extends User {}
