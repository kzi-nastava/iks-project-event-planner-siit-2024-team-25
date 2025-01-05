import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ReportUser } from '../model/report-user.model';
import { SuspendUserService } from '../service/suspend-user.service';
import { SuspendUserDialogComponent } from '../dialogs/suspend-user-dialog/suspend-user-dialog.component';

@Component({
  selector: 'app-all-reported-users',
  templateUrl: './all-reported-users.component.html',
  styleUrl: './all-reported-users.component.scss',
})
export class AllReportedUsersComponent {
  currentReports: ReportUser[] = [];
  displayedColumns = [
    'position',
    'date',
    'reportedUser',
    'description',
    'reporter',
    'actions',
  ];

  currentPage: number = 0;
  totalPages: number = 1;
  pageSize: number = 10;

  constructor(
    private dialog: MatDialog,
    private suspendUserService: SuspendUserService
  ) {}

  ngOnInit(): void {
    this.getAllReports();
  }

  updateReport(reportId: any) {}

  onSuspend(
    userId: number,
    firstName: String,
    lastName: String,
    reportId: number
  ) {
    const dialogRef = this.dialog.open(SuspendUserDialogComponent, {
      data: {
        userName: firstName + ' ' + lastName,
      },
      width: '24rem',
    });
    dialogRef.afterClosed().subscribe({
      next: (check) => {
        if (check) {
          this.suspendUserService.suspendUser(userId, reportId).subscribe({
            next: () => {
              this.getAllReports();
            },
            error: (err: any) => {
              console.log(err);
            },
          });
        }
      },
      error: (err: any) => {
        console.log(err);
      },
    });
  }

  getAllReports() {
    this.suspendUserService.getAllReports(this.currentPage).subscribe({
      next: (report) => {
        console.log(report.content);
        this.currentReports = report.content;
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
      this.getAllReports();
    }
  }

  previousPage() {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.getAllReports();
    }
  }
}
