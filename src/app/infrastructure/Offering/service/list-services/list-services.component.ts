import { Component, EventEmitter, Output } from '@angular/core';
import { Service } from '../model/service.model';

@Component({
  selector: 'app-list-services',
  templateUrl: './list-services.component.html',
  styleUrl: './list-services.component.scss'
})
export class ListServicesComponent {
    services = [
      new Service('Service 1', 'Desc 1', 1),
      new Service('Service 2', 'Desc 2', 2),
      new Service('Service 3', 'Desc 3', 3),
      new Service('Service 4', 'Desc 4', 4)
    ]
    isFilter:boolean = false;
    options: string[] = ['One', 'Two', 'Three'];

    filteredServices = [...this.services];
    onSearch(event: Event): void {
      const input = event.target as HTMLInputElement;
      const query = input.value || ''; 
      this.filteredServices = this.services.filter(service =>
        service.name.toLowerCase().includes(query.toLowerCase())
      );
    }

    @Output() toggle = new EventEmitter<void>();

    onToggle() {
      this.toggle.emit();
    }

    clickFilter(){
      this.isFilter = !this.isFilter;
    }

}


