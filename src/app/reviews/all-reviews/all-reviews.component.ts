import { Component } from '@angular/core';
import { Review } from '../models/review.model';
import { ReviewService } from '../services/review.service';

@Component({
  selector: 'app-all-reviews',
  templateUrl: './all-reviews.component.html',
  styleUrl: './all-reviews.component.scss',
})
export class AllReviewsComponent {
  currentComments: Review[] = [];
  displayedColumns = [
    'position',
    'user',
    'comment',
    'rating',
    'event',
    'offering',
    'createdDate',
  ];

  currentPage: number = 0;
  totalPages: number = 1;
  pageSize: number = 10;

  constructor(private reviewService: ReviewService) {}

  ngOnInit(): void {
    this.getAllSuspendedUsers();
  }

  getAllSuspendedUsers() {}

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
