import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { map, shareReplay } from 'rxjs';
import { UserRole } from '../../infrastructure/auth/model/user-role.model';
import { AuthService } from '../../infrastructure/auth/service/auth.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.scss',
})
export class NavComponent {
  isExpanded = false;

  constructor(
    private authService: AuthService,
    private breakpointObserver: BreakpointObserver,
    private router: Router,
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

  logOut() {
    this.authService.logOut();
    this.router.navigate(['/']);
  }
}
