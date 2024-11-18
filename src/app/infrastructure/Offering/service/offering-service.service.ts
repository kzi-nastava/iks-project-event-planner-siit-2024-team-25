import { Injectable } from '@angular/core';
import { Service } from './model/service.model';

@Injectable({
  providedIn: 'root'
})
export class OfferingServiceService {

  constructor() { }

  services = [
    new Service("Service 1", "Description 1", 100),
    new Service("Service 2", "Description 2", 200),
    new Service("Service 3", "Description 3", 300),
    new Service("Service 4", "Description 4", 400),
    new Service("Service 5", "Description 5", 500),
    new Service("Service 6", "Description 6", 600),
    new Service("Service 7", "Description 7", 700)
  ]

  getAll() : Service[]{
    return this.services;
  }

  getServiceByName(name :string) : Service|null{
    for(let s of this.services){
      if(s.name == name){
        return s;
      }
    }
    return null;
  }

  addService(s : Service): Service|null{
    if(this.services.push(s)){return s;}
    return null;
  }
  
}
