import { Component, OnInit } from '@angular/core';
import { Review } from '../model/review-model';
import { ReviewService } from '../services/review.service';

@Component({
  selector: 'app-event-offering-review-list',
  templateUrl: './event-offering-review-list.component.html',
  styleUrl: './event-offering-review-list.component.scss'
})
export class EventOfferingReviewListComponent implements OnInit {

  reviews: Review[] = []
  displayedColumns = ["position", "userName", "comment", "rating"]
  currentPage: number = 0;
  totalPages: number = 1;
  eventOfferingName: string = "";
  eventId = null;
  offeringId = null;

  constructor(private reviewService: ReviewService) { }
  ngOnInit(): void {
    const eventFromState = window.history.state['eventId'];
    if (eventFromState) {
      this.eventId = eventFromState;
    } else {
      console.log("event id not found")
      const offeringFromState = window.history.state['offeringId'];
      if (offeringFromState) {
        this.offeringId = offeringFromState;
      } else {
        console.log("event id not found")
      }
    }
    const eventOfferingNameFromState = window.history.state['eventOfferingName'];
    if (eventOfferingNameFromState) {
      this.eventOfferingName = eventOfferingNameFromState;
    } else {
      console.log("event id not found")
    }
    this.getReviews();
  }

  getReviews(){
    if(this.eventId!=null){
      this.reviewService.getReviewsByEvent(this.eventId,this.currentPage).subscribe({
        next:(res)=>{
          this.reviews= res.reviews;
          this.totalPages = res.totalPages;
        },
        error:()=>{
          console.log("error")
        }
      })
    }else if(this.offeringId != null){
      this.reviewService.getReviewsByOffering(this.offeringId,this.currentPage).subscribe({
        next:(res)=>{
          this.reviews= res.reviews;
          this.totalPages = res.totalPages;
        },
        error:()=>{
          console.log("error")
        }
      })
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
