import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environment/environment';
import { BlockUserRequest } from '../chat/model/block-user.request.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BlockService {
  constructor(private httpClient: HttpClient) {}

  blockUser(blockerId: number, blockedId: number) {
    let params: BlockUserRequest = {
      blockerUserId: blockerId,
      blockedUserId: blockedId,
    };

    return this.httpClient.post(
      `${environment.apiHost}/api/users/block`,
      params
    );
  }

  isBlocked(blockedUserId: number): Observable<boolean> {
    return this.httpClient.get<boolean>(
      `${environment.apiHost}/api/users/block/${blockedUserId}`
    );
  }
}
