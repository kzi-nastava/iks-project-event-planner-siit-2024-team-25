import { Component } from '@angular/core';
import { Event } from '@angular/router';
import { BudgetItem } from '../model/budget-item.model';

@Component({
  selector: 'app-budget-plan',
  templateUrl: './budget-plan.component.html',
  styleUrl: './budget-plan.component.scss'
})
export class BudgetPlanComponent {


  eventName: String | undefined = "Event one";
  eventId: number | undefined;
  budgetItems: BudgetItem[] = []
  displayedColumns = ['offeringCategory', 'budget', 'edit','delete'];

  constructor() { }

  onDelete(arg0: any) {
    throw new Error('Method not implemented.');
  }
  onEdit(arg0: any) {
    throw new Error('Method not implemented.');
  }
}
