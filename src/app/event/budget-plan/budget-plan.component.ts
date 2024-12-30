import { Component, OnInit } from '@angular/core';
import { BudgetItem } from '../model/budget-item.model';
import { EventService } from '../service/event.service';
import { Event } from '../model/event.model';
import { EventTypeService } from '../service/event-type.service';
import { EventType } from '../model/event.type.model';
import { BudgetPlanService } from '../service/budget-plan.service';
import { BudgetItemRequestDTO } from '../model/budget-item-request.dto';
import { SaveDialogComponent } from '../dialogs/save-dialog/save-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { DeleteDialogComponent } from '../../offering/offering-category/dialogs/delete-dialog/delete-dialog.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-budget-plan',
  templateUrl: './budget-plan.component.html',
  styleUrl: './budget-plan.component.scss',
})
export class BudgetPlanComponent implements OnInit {
  eventId: number | any = null;
  event: Event | undefined;

  budgetItems: BudgetItem[] = [];
  overallBudget: number = 0;
  displayedColumns = ['offeringCategory', 'budget', 'edit', 'delete'];

  budgetField = 0;
  offeringIdField = -1;

  constructor(
    private eventService: EventService,
    private budgetItemService: BudgetPlanService,
    public dialog: MatDialog,
  ) {
    
  }
  ngOnInit(): void {
    const eventFromState = window.history.state['eventId'];
    if (eventFromState) {
      this.eventId = eventFromState;
    }else{
      console.log("event id not found")
    }
    this.getBudgetItems();
  }

  getBudgetItems() {
    this.eventService.getEvent(this.eventId).subscribe({
      next: (e: Event) => {
        console.log(e)
        this.event = e;
        this.budgetItemService.getBudgetItemsByEvent(e.id).subscribe({
          next: (res) => {
            this.budgetItems = res;
            this.overallBudget = 0;
            res.forEach((element) => {
              this.overallBudget += element.budget;
            });
          },
          error: (_) => {
            console.log('error');
          },
        });
      },
      error: (_) => {
        console.log('error');
      },
    });
  }

  openCreateDialog() {
    const dialogRef = this.dialog.open(SaveDialogComponent, {
      data: {
        budget: 0,
        eventTypeId: this.event?.eventType.id,
        eventId: this.event?.id,
        isEdit: false,
      },
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.budgetField = res.budget;
        this.offeringIdField = res.offerId;
        this.saveBudgetItem();
      }
    });
  }
  saveBudgetItem() {
    const budgetItem = this.onCreate();
    this.budgetItemService.createBudgetItemForEevnt(budgetItem).subscribe({
      next: (res) => {
        this.getBudgetItems();
      },
      error(err) {
        console.log(err);
      },
    });
  }
  onCreate() {
    const budgetItem: BudgetItemRequestDTO = {
      budget: this.budgetField,
      offeringCategoryId: this.offeringIdField,
      eventId: this.eventId,
    };
    return budgetItem;
  }

  openEditDialog(id: number, budget: number) {
    const dialogRef = this.dialog.open(SaveDialogComponent, {
      data: {
        budget: budget,
        eventTypeId: this.event?.eventType.id,
        eventId: this.event?.id,
        isEdit: true,
      },
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.budgetField = res.budget;
        this.editBudgetItem(id);
      }
    });
  }
  editBudgetItem(id: number) {
    const budgetItem = this.onEdit();
    this.budgetItemService.updateBudgetItem(budgetItem, id).subscribe({
      next: (res) => {
        this.getBudgetItems();
      },
      error: (_) => {
        console.log('error');
      },
    });
  }
  onEdit() {
    const budgetItem: BudgetItemRequestDTO = {
      budget: this.budgetField,
    };
    return budgetItem;
  }

  onDelete(id: number, name: String) {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      data: {
        nameCategory: name,
      },
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.budgetItemService.deleteBudgetItem(id).subscribe({
          next: () => {
            this.getBudgetItems();
          },
          error: (_) => {
            console.log('error');
          },
        });
      }
    });
  }
}
