import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ReportUser } from '../model/report-user.model';
import { Page } from '../../shared/model/page.mode';
import { environment } from '../../../environment/environment';
import { SuspendUserRequest } from '../model/suspend-user.request.mode';
import { SuspendUserResponse } from '../model/suspend-user.response.model';
import { ReportUserUpdateRequest } from '../model/report-user.update.request.model';

@Injectable({
  providedIn: 'root',
})
export class SuspendUserService {
  constructor(private httpClient: HttpClient) {}

  getAllReports(page: number): Observable<Page<ReportUser>> {
    let params = new HttpParams();
    params = params.set('page', page);
    params = params.set('viewed', false);

    return this.httpClient.get<Page<ReportUser>>(
      environment.apiHost + '/api/users/reports',
      {
        params,
      }
    );
  }

  getAllSuspendedUsers(page: number) {
    let params = new HttpParams();
    params = params.set('page', page);

    return this.httpClient.get<Page<ReportUser>>(
      environment.apiHost + '/api/users/suspended',
      {
        params,
      }
    );
  }

  suspendUser(
    userId: number,
    reportId: number
  ): Observable<SuspendUserResponse> {
    const suspendUserRequest: SuspendUserRequest = {
      userId: userId,
      reportId: reportId,
    };
    return this.httpClient.post<SuspendUserResponse>(
      environment.apiHost + '/api/users/suspend',
      suspendUserRequest
    );
  }

  updateReport(reportId: number, viewed: boolean): Observable<ReportUser> {
    const request: ReportUserUpdateRequest = {
      reportId: reportId,
      isViewed: viewed,
    };
    return this.httpClient.put<ReportUser>(
      environment.apiHost + '/api/users/report',
      request
    );
  }
}
