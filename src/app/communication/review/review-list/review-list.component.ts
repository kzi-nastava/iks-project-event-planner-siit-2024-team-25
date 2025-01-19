import { Component, OnInit } from '@angular/core';
import { Review } from '../model/review-model';
import { ReviewService } from '../services/review.service';
import { AuthService } from '../../../infrastructure/auth/service/auth.service';
import { UserRole } from '../../../infrastructure/auth/model/user-role.model';

@Component({
  selector: 'app-review-list',
  templateUrl: './review-list.component.html',
  styleUrl: './review-list.component.scss'
})
export class ReviewListComponent implements OnInit{
  reviews: Review[] = []
  displayedColumns = ["position","userName","eventName","comment","rating"]
  currentPage: number = 0;
  totalPages: number = 1;
  eventReview: boolean = true;
  constructor(private reviewService:ReviewService, private authService: AuthService){}
  ngOnInit(): void {
    if(this.authService.getUser()?.role == UserRole.EventOrganizer){
      this.eventReview = true
    }else{this.eventReview = false}
    this.getReviews();
  }
  getEventReviewsByOrganizer(){
      this.reviewService.getEventReviewsByOrganizer(this.currentPage).subscribe({
        next:(res)=>{
          this.reviews = res.reviews;
          this.totalPages = res.totalPages;
        },
        error:()=>{
          console.log("error")
        }
      })
    
  }
  getOfferingReviewsByOwner(){
      this.reviewService.getOfferingReviewsByOwner(this.currentPage).subscribe({
        next:(res)=>{
          this.reviews = res.reviews;
          this.totalPages = res.totalPages;
        },
        error:()=>{
          console.log("error")
        }
      })
    
  }
  getReviews(){
    if(this.eventReview == true){
      this.getEventReviewsByOrganizer();
    }else{
      this.getOfferingReviewsByOwner();
    }
  }

  scrollDown() {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.getReviews();

    }
  }
  scrollUp() {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.getReviews();

    }

  }
}
