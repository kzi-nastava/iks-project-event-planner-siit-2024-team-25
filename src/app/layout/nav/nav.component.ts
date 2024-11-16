import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component } from '@angular/core';
import { map, shareReplay } from 'rxjs';
import { UserRole } from '../../infrastructure/auth/model/user-role.model';
import { AuthService } from '../../infrastructure/auth/service/auth.service';
import { ServiceService } from '../../infrastructure/Offering/service/services/service.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.scss',
})
export class NavComponent {
  isExpanded = false;

  constructor(
    private authService: AuthService,
    private serviceService: ServiceService,
    private breakpointObserver: BreakpointObserver,
  ) {}

  loggedIn$ = this.authService.loggedIn$;

  isOwner$ = this.authService.userRole$.pipe(
    map((role) => role == UserRole.Owner),
  );

  isOrganizer$ = this.authService.userRole$.pipe(
    map((role) => role == UserRole.EventOrganizer),
  );

  isAdmin$ = this.authService.userRole$.pipe(
    map((role) => role == UserRole.Admin),
  );

  isHandset$ = this.breakpointObserver.observe([Breakpoints.Handset]).pipe(
    map((result) => result.matches),
    shareReplay(),
  );

  toggleExpanded(): void {
    this.isExpanded = !this.isExpanded;
  }
}
