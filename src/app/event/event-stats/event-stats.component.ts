import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChartConfiguration } from 'chart.js';
import { MatTableDataSource } from '@angular/material/table';
import { forkJoin, Subject, BehaviorSubject } from 'rxjs';
import { takeUntil, switchMap } from 'rxjs/operators';
import { ReviewStats } from '../model/review-stats.model';
import { Attendee } from '../model/attendee.model';
import { Event } from '../model/event.model';
import { EventService } from '../service/event.service';
import { environment } from '../../../environment/environment';
import { ErrorResponse } from '../../shared/model/error.response.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-event-stats',
  templateUrl: './event-stats.component.html',
  styleUrls: ['./event-stats.component.scss'],
})
export class EventStatsComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private eventId$ = new BehaviorSubject<number>(0);

  event?: Event;
  reviewStats?: ReviewStats;
  attendeesDataSource = new MatTableDataSource<Attendee>();
  displayedColumns: string[] = ['fullName'];
  currentPage = 0;
  totalAttendees = 0;

  barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: ['1⭐', '2⭐', '3⭐', '4⭐', '5⭐'],
    datasets: [
      {
        data: [0, 0, 0, 0, 0],
        label: 'Number of Reviews',
        backgroundColor: '#7B1FA2',
      },
    ],
  };

  barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  constructor(
    private eventService: EventService,
    private route: ActivatedRoute,
    private toastService: ToastrService
  ) {}

  ngOnInit() {
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      this.eventId$.next(+params['id']);
    });

    this.eventId$
      .pipe(
        takeUntil(this.destroy$),
        switchMap((eventId) =>
          forkJoin({
            event: this.eventService.getEvent(eventId),
            reviewStats: this.eventService.getReviewStats(eventId),
            attendeesData: this.eventService.getAttendees(
              eventId,
              this.currentPage
            ),
          })
        )
      )
      .subscribe(({ event, reviewStats, attendeesData }) => {
        this.event = event;
        this.reviewStats = reviewStats;
        this.attendeesDataSource.data = attendeesData.attendees;
        this.totalAttendees = attendeesData.totalAttendees;

        // Update chart data
        this.barChartData.datasets[0].data = [
          reviewStats.reviewCounts[1] || 0,
          reviewStats.reviewCounts[2] || 0,
          reviewStats.reviewCounts[3] || 0,
          reviewStats.reviewCounts[4] || 0,
          reviewStats.reviewCounts[5] || 0,
        ];
      });
  }

  downloadReport(): void {
    const eventId = this.eventId$.getValue();
    if (!eventId) return;

    this.eventService
      .downloadStatsReport(eventId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (blob: Blob) => {
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `event-${eventId}-report.pdf`;
          link.click();
          window.URL.revokeObjectURL(url);
        },
        error: (err: ErrorResponse) => {
          console.error('Download failed:', err);
          this.toastService.error(err.message, 'Failed to generate a report');
        },
      });
  }

  getProfilePictureUrl(userId: number): string {
    if (!userId) return 'placeholder-avatar.png';
    return environment.apiHost + `/api/users/${userId}/profile-picture`;
  }

  setDefaultAvatar(event: any): void {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = 'placeholder-avatar.png';
  }

  loadMore() {
    this.currentPage++;
    this.eventId$
      .pipe(
        takeUntil(this.destroy$),
        switchMap((eventId) =>
          this.eventService.getAttendees(eventId, this.currentPage)
        )
      )
      .subscribe(({ attendees }) => {
        this.attendeesDataSource.data = [
          ...this.attendeesDataSource.data,
          ...attendees,
        ];
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
