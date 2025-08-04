import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environment/environment';
import { ReportUserRequest } from '../model/report.user.request.model';

@Injectable({
  providedIn: 'root',
})
export class ReportUserService {
  constructor(private httpClient: HttpClient) {}

  reportUser(request: ReportUserRequest): Observable<void> {
    console.log(request);
    return this.httpClient.post<void>(
      environment.apiHost + '/api/users/report',
      request
    );
  }
}
