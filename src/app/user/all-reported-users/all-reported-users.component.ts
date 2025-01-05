import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { switchMap } from 'rxjs';
import { ApproveDialogComponent } from '../../offering/offering-category/dialogs/approve-dialog/approve-dialog.component';
import { CreateDialogComponent } from '../../offering/offering-category/dialogs/create-dialog/create-dialog.component';
import { DeleteDialogComponent } from '../../offering/offering-category/dialogs/delete-dialog/delete-dialog.component';
import { EditDialogComponent } from '../../offering/offering-category/dialogs/edit-dialog/edit-dialog.component';
import { OfferingCategoryType } from '../../offering/offering-category/model/offering-category-type.enum';
import { SubmittedOffering } from '../../offering/offering-category/model/submitted-offering';
import { OfferingCategoryService } from '../../offering/offering-category/offering-category.service';
import { OfferingService } from '../../offering/services/offering.service';
import { OfferingCategory } from '../../offering/offering-category/model/offering-category';
import { ReportUser } from '../model/report-user.model';
import { SuspendUserService } from '../service/suspend-user.service';

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

  updateReport(category: any) {}

  onSuspend(id: number, name: String) {
    // const dialogRef = this.dialog.open(DeleteDialogComponent, {
    //   data: {
    //     nameCategory: name,
    //   },
    //   width: '24rem',
    // });
    // dialogRef.afterClosed().subscribe({
    //   next: (check) => {
    //     if (check) {
    //       this.offeringCategoryService.deleteOfferingCategory(id).subscribe({
    //         next: () => {
    //           this.getAllReports();
    //         },
    //         error: (_) => {
    //           console.log('error');
    //         },
    //       });
    //     }
    //   },
    //   error: (_) => {
    //     console.log('error');
    //   },
    // });
  }

  getAllReports() {
    this.suspendUserService.getAllReports(this.currentPage).subscribe({
      next: (report) => {
        this.currentReports = report.content;
        this.totalPages = report.totalPages;
      },
      error: (_) => {
        console.log('error');
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
