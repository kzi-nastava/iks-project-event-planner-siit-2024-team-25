import { Component } from '@angular/core';
import { SuspendUserResponse } from '../model/suspend-user.response.model';
import { SuspendUserService } from '../service/suspend-user.service';

@Component({
  selector: 'app-all-blocked-users',
  templateUrl: './all-blocked-users.component.html',
  styleUrl: './all-blocked-users.component.scss',
})
export class AllBlockedUsersComponent {
  currentUsers: SuspendUserResponse[] = [];
  displayedColumns = ['position', 'reportedUser', 'expirationTime'];

  currentPage: number = 0;
  totalPages: number = 1;
  pageSize: number = 10;

  constructor(private suspendUserService: SuspendUserService) {}

  ngOnInit(): void {
    this.getAllSuspendedUsers();
  }

  getAllSuspendedUsers() {
    this.suspendUserService.getAllSuspendedUsers(this.currentPage).subscribe({
      next: (report) => {
        console.log(report.content);
        this.currentUsers = report.content;
        this.totalPages = report.totalPages;
      },
      error: (err: any) => {
        console.log(err);
      },
    });
  }

  nextPage() {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.getAllSuspendedUsers();
    }
  }

  previousPage() {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.getAllSuspendedUsers();
    }
  }
}
