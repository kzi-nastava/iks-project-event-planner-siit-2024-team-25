import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../../environment/environment';
import { User } from '../auth/model/user.model';
import { AuthService } from '../auth/service/auth.service';
import { Location } from './location.model';

@Injectable({
  providedIn: 'root',
})
export class AddressService {
  address = new BehaviorSubject<Location | null>(null);

  address$ = this.address.asObservable();

  getAddress() {
    return this.address.getValue();
  }

  constructor(
    private authService: AuthService,
    private httpClient: HttpClient,
  ) {
    this.init();
  }

  init() {
    this.authService.user$.subscribe({
      next: (user: User | null) => {
        if (!!user) {
          this.httpClient
            .get<Location>(
              environment.apiHost + `/api/users/${user.userId}/location`,
            )
            .subscribe({
              next: (address: Location) => {
                this.address.next(address);
              },
              error: () => {
                this.address.next(null);
              },
            });
        } else {
          this.address.next(null);
        }
      },
    });
  }
}
