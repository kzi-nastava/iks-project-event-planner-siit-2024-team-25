import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from '../service/event.service';

@Component({
  selector: 'app-event-page',
  templateUrl: './event-page.component.html',
  styleUrl: './event-page.component.scss',
})
export class EventPageComponent implements OnInit {
  eventId!: number;
  invitationCode!: string;

  constructor(
    private route: ActivatedRoute,
    private eventService: EventService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.eventId = +params['id'];
      this.route.queryParams.subscribe((params) => {
        this.invitationCode = params['invitationCode'];

        this.eventService
          .getEvent(this.eventId, this.invitationCode)
          .subscribe({
            next: () => {
              console.log('vratio se zahtev');
            },
            error: () => {
              this.router.navigateByUrl('/');
            },
          });
      });
    });
  }
}
