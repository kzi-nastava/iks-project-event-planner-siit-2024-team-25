import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ReportUser } from '../model/report-user.model';
import { Page } from '../../shared/model/page.mode';
import { environment } from '../../../environment/environment';
import { SuspendUserRequest } from '../model/suspend-user.request.mode';

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

  suspendUser(userId: number, reportId: number): Observable<Response> {
    const suspendUserRequest: SuspendUserRequest = {
      userId: userId,
      reportId: reportId,
    };
    console.log(suspendUserRequest);
    return this.httpClient.post<Response>(
      environment.apiHost + '/api/users/suspend',
      suspendUserRequest
    );
  }
}
