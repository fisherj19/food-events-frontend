import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { AuthService } from '../services/auth.service';

import { EventService, FoodEvent } from './event.service';

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
    ]).subscribe(([isAdmin, events]) => {
      this.isAdmin = isAdmin;
      this.events = events;
      this.ready = true;
    });
  }
  send(): void {
    this.eventService.send().subscribe();
  }
  sendWeek(): void {
    this.eventService.sendWeek().subscribe();
  }
  sendDay(): void {
    this.eventService.sendDay().subscribe();
  }
}
