import { Component, OnInit } from '@angular/core';
import { BudgetItem } from '../model/budget-item.model';
import { EventService } from '../service/event.service';
import { Event } from '../model/event.model';
import { EventTypeService } from '../service/event-type.service';
import { EventType } from '../model/event.type.model';
import { BudgetPlanService } from '../service/budget-plan.service';
import { BudgetItemRequestDTO } from '../model/budget-item-request.dto';

@Component({
  selector: 'app-budget-plan',
  templateUrl: './budget-plan.component.html',
  styleUrl: './budget-plan.component.scss'
})
export class BudgetPlanComponent implements OnInit{

  eventId: number = 25;
  event: Event | undefined;

  budgetItems: BudgetItem[] = []
  budgetItemsTemp: BudgetItem[] = []
  overallBudget: number = 0;
  displayedColumns = ['offeringCategory', 'budget', 'edit','delete'];

  constructor(private eventService: EventService, private eventTypeService:EventTypeService, private budgetItemService: BudgetPlanService) { }
  ngOnInit(): void {
    this.eventService.getEvent(this.eventId).subscribe({
      next:(e:Event)=>{
        this.event = e;
        this.budgetItemService.getBudgetItemsByEvent(e.id).subscribe({
          next: (res)=>{
            console.log(res)
            this.budgetItems = res
          } ,
          error:(_) => {
            console.log("error")
          }
        })
      },
      error:(_)=>{
        console.log("error");
      }
    })
  }

  saveBudgetItem(){
    const budgetItem = this.onCreate()
    this.budgetItemService.createBudgetItemForEevnt(budgetItem).subscribe({
      next:(res)=>{
        console.log(res)
      },
      error(err) {
        console.log(err)
      },
    })
  }

  onDelete(arg0: any) {
    throw new Error('Method not implemented.');
  }
  onEdit(arg0: any) {
    throw new Error('Method not implemented.');
  }
  onCreate(){
    const budgetItem: BudgetItemRequestDTO = {
      budget: 100,
      offeringCategoryId: 9,
      eventId: this.eventId,
    }
    return budgetItem;
  }
}
