import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../services/auth.service';

import { EventService, FoodEvent } from './event.service';
import { EventDetailsComponent } from './event-details.component';


@Component({
  templateUrl: './events.component.html'
})
export class EventsComponent implements OnInit {
  ready = false;
  events: FoodEvent[];
  isAdmin = false;

  constructor(
    private authService: AuthService,
    private eventService: EventService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    forkJoin([ // forkJoin subscribes to both service calls at once
      this.authService.isAdmin(),
      this.eventService.getAll()
    ]).subscribe(([isAdmin, events]) => {
      this.isAdmin = isAdmin;
      this.events = events;
      this.ready = true;
    });
  }
  send(): void {
    this.eventService.send().subscribe();
  }

  onView(e: FoodEvent): void {
    this.dialog.open(
      EventDetailsComponent,
      {
        width: '750px',
        data: e
      }
    );
  }
}
