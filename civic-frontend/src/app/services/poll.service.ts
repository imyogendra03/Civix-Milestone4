import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';

import {
  Poll,
  PollResponse,
  PollResultResponse,
  PollDashboardStats,
  CreatePollRequest,
  VotePollRequest
} from '../models/poll.model';

@Injectable({
  providedIn: 'root'
})
export class PollService {

  private http = inject(HttpClient);

  private readonly baseUrl = `${environment.apiUrl}/polls`;

  constructor() {}

  // Get all polls
  getAllPolls(): Observable<PollResponse[]> {
    return this.http.get<PollResponse[]>(this.baseUrl);
  }

  // ✅ Get My Polls
  getMyPolls(): Observable<PollResponse[]> {
    return this.http.get<PollResponse[]>(
      `${this.baseUrl}/my-polls`
    );
  }

  // Get poll by ID
  getPollById(id: number): Observable<Poll> {
    return this.http.get<Poll>(
      `${this.baseUrl}/${id}`
    );
  }

  // Create new poll
  createPoll(data: CreatePollRequest): Observable<PollResponse> {
    return this.http.post<PollResponse>(
      this.baseUrl,
      data
    );
  }
// Delete Poll
deletePoll(id: number) {
  return this.http.delete(
    `${this.baseUrl}/${id}`,
    {
      responseType: 'text'
    }
  );
}
  // Vote in a poll
  votePoll(
    pollId: number,
    data: VotePollRequest
  ): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/${pollId}/vote`,
      data
    );
  }

  // Get poll results
  getPollResults(
    pollId: number
  ): Observable<PollResultResponse> {
    return this.http.get<PollResultResponse>(
      `${this.baseUrl}/${pollId}/results`
    );
  }

  // Dashboard statistics
  getDashboardStats(): Observable<PollDashboardStats> {
    return this.http.get<PollDashboardStats>(
      `${this.baseUrl}/stats`
    );
  }

}