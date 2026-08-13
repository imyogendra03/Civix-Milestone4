import { Injectable, inject } from '@angular/core';
    import { HttpClient, HttpParams } from '@angular/common/http';
    import { Observable } from 'rxjs';
    import { environment } from '../../environments/environment';
    import { Official, PageResponse } from '../models/official.model';

    type OfficialPage = PageResponse<Official>;

    @Injectable({ providedIn: 'root' })
    export class OfficialService {
    private http = inject(HttpClient);
    private baseUrl = `${environment.apiUrl}/officials`;

    getOfficials(page = 0, size = 12, search?: string): Observable<OfficialPage> {
      let params = new HttpParams().set('page', page).set('size', size);
      if (search) params = params.set('search', search);
      return this.http.get<OfficialPage>(this.baseUrl, { params });
    }

    getOfficialById(id: number): Observable<Official> {
      return this.http.get<Official>(`${this.baseUrl}/${id}`);
    }
    }
    