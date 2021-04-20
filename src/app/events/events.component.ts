import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
//import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AuthService } from '../services/auth.service';

import { EventService, FoodEvent } from './event.service';
//import { EventDetailsComponent } from './event-details.component';

@Component({
  templateUrl: './events.component.html'
})
export class EventsComponent implements OnInit {
  ready = false;
  events: FoodEvent[];
  isAdmin = false;

  constructor(
    private authService: AuthService,
    private eventService: EventService
  ) { }

  ngOnInit(): void {
    forkJoin([ // forkJoin subscribes to both service calls at once
      this.authService.isAdmin(),
      this.eventService.getAll()
    ]).subscribe(([is_admin, events]) => {
      this.isAdmin = is_admin;
      this.events = events;
      this.ready = true;
    });
  }

  /*
  onView(e: FoodEvent): void {
    const dialogRef: MatDialogRef<EventDetailsComponent> = this.dialog.open(
      EventDetailsComponent,
      {
        width: '1000px',
      }
    );
  }
  */
}
