import { Injectable } from '@angular/core';
import { Service } from './model/service';
import { Offeringtype } from './model/offering.type.enum';
import { ReservationType } from './model/reservation.type.enum';
import { map, Observable, of, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environment/environment';
import { Page } from '../../shared/model/page.mode';

@Injectable({
  providedIn: 'root'
})
export class OfferingServiceService {

  constructor(private httpClinet: HttpClient) { }

  services: Service[] = [
    {
      id: 1,
      name: "Web Development",
      description: "Develop modern and responsive websites.",
      price: 1200,
      images: ["event-planning.jpg"],
      discount: 10,
      isVisible: true,
      isAvailable: true,
      offeringType: Offeringtype.ACCEPTED,
      specifics: "Includes front-end and back-end development",
      duration: 30,
      cancellationDeadline: 4,
      reservationDeadline: 6,
      reservationType: ReservationType.AUTOMATIC,
      eventTypes: [],
      offeringCategory: { name: '1' },
      minArrangement: 0,
      maxArrangement: 0
    },
    {
      id: 2,
      name: "Graphic Design",
      description: "Professional logo and branding design.",
      price: 800,
      images: ["event-planning.jpg"],
      discount: 15,
      isVisible: true,
      isAvailable: false,
      offeringType: Offeringtype.ACCEPTED,
      specifics: "Focuses on corporate identity and creativity",
      duration: 10,
      cancellationDeadline: 4,
      reservationDeadline: 6,
      reservationType: ReservationType.AUTOMATIC,
      eventTypes: [],
      offeringCategory: { name: '1' },
      minArrangement: 0,
      maxArrangement: 0
    },
    {
      id: 3,
      name: "SEO Optimization",
      description: "Boost your website's ranking on search engines.",
      price: 600,
      images: ["event-planning.jpg"],
      discount: 5,
      isVisible: true,
      isAvailable: true,
      offeringType: Offeringtype.PENDING,
      specifics: "Includes keyword analysis and technical SEO",
      duration: 15,
      cancellationDeadline: 4,
      reservationDeadline: 6,
      reservationType: ReservationType.MANUAL,
      eventTypes: [],
      offeringCategory: { name: '1' },
      minArrangement: 0,
      maxArrangement: 0
    },
    {
      id: 4,
      name: "Content Writing",
      description: "High-quality content tailored to your needs.",
      price: 400,
      images: ["event-planning.jpg"],
      discount: 20,
      isVisible: true,
      isAvailable: true,
      offeringType: Offeringtype.PENDING,
      specifics: "Includes blog posts, articles, and product descriptions",
      duration: 7,
      cancellationDeadline: 4,
      reservationDeadline: 6,
      reservationType: ReservationType.AUTOMATIC,
      eventTypes: [],
      offeringCategory: { name: '1' },
      minArrangement: 0,
      maxArrangement: 0
    },
    {
      id: 5,
      name: "Photography",
      description: "Capture moments with professional photography.",
      price: 1500,
      images: ["event-planning.jpg"],
      discount: 10,
      isVisible: false,
      isAvailable: true,
      offeringType: Offeringtype.ACCEPTED,
      specifics: "Includes editing and digital delivery",
      duration: 5,
      cancellationDeadline: 4,
      reservationDeadline: 6,
      reservationType: ReservationType.MANUAL,
      eventTypes: [],
      offeringCategory: { name: '1' },
      minArrangement: 0,
      maxArrangement: 0
    },
    {
      id: 6,
      name: "Video Production",
      description: "Create stunning videos for your business or events.",
      price: 2000,
      images: ["event-planning.jpg"],
      discount: 0,
      isVisible: true,
      isAvailable: false,
      offeringType: Offeringtype.ACCEPTED,
      specifics: "Includes shooting, editing, and sound design",
      duration: 20,
      cancellationDeadline: 4,
      reservationDeadline: 6,
      reservationType: ReservationType.AUTOMATIC,
      eventTypes: [],
      offeringCategory: { name: '1' },
      minArrangement: 0,
      maxArrangement: 0
    },
    {
      id: 7,
      name: "Event Planning",
      description: "Organize unforgettable events tailored to your needs.",
      price: 1000,
      images: ["event-planning.jpg"],
      discount: 5,
      isVisible: true,
      isAvailable: true,
      offeringType: Offeringtype.ACCEPTED,
      specifics: "Includes venue selection and catering",
      duration: -1,
      cancellationDeadline: 4,
      reservationDeadline: 6,
      reservationType: ReservationType.AUTOMATIC,
      eventTypes: [{ name: 'dasd' }],
      offeringCategory: { name: '1' },
      minArrangement: 2,
      maxArrangement: 3
    },
    {
      id: 8,
      name: "Event Planning",
      description: "Organize unforgettable events tailored to your needs.",
      price: 1000,
      images: ["event-planning.jpg"],
      discount: 5,
      isVisible: true,
      isAvailable: true,
      offeringType: Offeringtype.ACCEPTED,
      specifics: "Includes venue selection and catering",
      duration: -1,
      cancellationDeadline: 4,
      reservationDeadline: 6,
      reservationType: ReservationType.MANUAL,
      eventTypes: [{ name: 'event 1' }],
      offeringCategory: { name: '1' },
      minArrangement: 2,
      maxArrangement: 3
    }
  ];


  getAll(): Observable<Service[]> {
    return this.httpClinet
    .get<Page<Service>>("http://localhost:8080/api/services")
    .pipe(map((page) => page.content));
  }

  getServiceById(id: number): Observable<Service> {
    const s = this.services.find(service => service.id === id);
    if (s) {
      return of(s); 
    } else {
      return throwError(() => new Error(`Service with ID ${id} not found`)); 
    }
  }

  addService(s: Service|undefined): Observable<Service> {
    if(s != null){
      if (this.services.push(s)) {
        console.log('Service you created: ');
        console.log(s);
      }
    }
    
    return of();
  }

  updateService(updatedService: Service|undefined): Observable<Service> {
    if(updatedService != null){
      const index = this.services.findIndex(service => service.id === updatedService.id);
      if (index !== -1) {
        this.services[index] = updatedService;
        console.log('Service you updated: ');
        console.log(updatedService);
        return of(updatedService);
      }
    }
    return of();
  }
}
