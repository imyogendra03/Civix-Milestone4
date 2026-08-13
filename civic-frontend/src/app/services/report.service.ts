import { Injectable, inject } from '@angular/core';
import {
  HttpClient,
  HttpParams
} from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

export interface MonthlyReport {
  year: number;
  month: number;
  monthName: string;

  totalPetitions: number;
  totalSignatures: number;
  totalPolls: number;
  totalVotes: number;

  activeEngagement: number;

  activePetitions: number;
  underReviewPetitions: number;
  approvedPetitions: number;
  rejectedPetitions: number;
  closedPetitions: number;

  activePolls: number;
  closedPolls: number;
}


@Injectable({
  providedIn: 'root'
})
export class ReportService {

  private http = inject(HttpClient);

  private url =
    environment.apiUrl + '/reports';


  monthly(
    year: number,
    month: number
  ): Observable<MonthlyReport> {

    const params =
      new HttpParams()
        .set('year', year)
        .set('month', month);

    return this.http.get<MonthlyReport>(
      `${this.url}/monthly`,
      { params }
    );
  }


  exportPdf(
    year: number,
    month: number
  ) {

    const params =
      new HttpParams()
        .set('year', year)
        .set('month', month);

    return this.http.get(
      `${this.url}/monthly/export/pdf`,
      {
        params,
        responseType: 'blob'
      }
    );
  }


  exportExcel(
    year: number,
    month: number
  ) {

    const params =
      new HttpParams()
        .set('year', year)
        .set('month', month);

    return this.http.get(
      `${this.url}/monthly/export/excel`,
      {
        params,
        responseType: 'blob'
      }
    );
  }

}