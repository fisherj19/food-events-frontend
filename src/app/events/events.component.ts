import { Component, OnInit } from '@angular/core';
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
    this.isAdmin = this.authService.isAdmin();
    this.eventService.getAll().subscribe(events => {
      this.events = events;
      this.ready = true;
    });
  }
}
