import { Component, OnInit } from '@angular/core';

import { EventService, FoodEvent } from './event.service';

@Component({
  templateUrl: './events.component.html'
})
export class EventsComponent implements OnInit {
  ready = false;
  events: FoodEvent[];

  constructor(private eventService: EventService) { }

  ngOnInit(): void {
    this.eventService.getAll().subscribe(events => {
      this.events = events;
      this.ready = true;
    });
  }
}
