import { Component, OnInit, } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import addMonths from 'date-fns/addMonths';
import eachDayOfInterval from 'date-fns/eachDayOfInterval';
import endOfDay from 'date-fns/endOfDay';
import endOfWeek from 'date-fns/endOfWeek';
import format from 'date-fns/format';
import isSameDay from 'date-fns/isSameDay';
import isWithinInterval from 'date-fns/isWithinInterval';
import lastDayOfMonth from 'date-fns/lastDayOfMonth';
import setDate from 'date-fns/setDate';
import startOfDay from 'date-fns/startOfDay';
import startOfWeek from 'date-fns/startOfWeek';
import { EventDetailsComponent } from '../events/event-details.component';

import { EventService, FoodEvent } from '../events/event.service';

interface Event {
  calendarEvent: FoodEvent;
  times: string;
}

interface EventCard {
  day: Date;
  title: string;
  cols: number;
  rows: number;
  rawEvents: FoodEvent[];
  events: Event[];
  moreColor: string;
  todayColor: string;
}

export interface DayData {
  day: Date;
  events: FoodEvent[];
}

@Component({
  selector: 'app-calendar', 
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {
  thisMonth: string;
  lastMonth: string;
  nextMonth: string;
  cards: EventCard[];
  private now: Date;

  constructor(
    public dialogue: MatDialog,
    private readonly eventService: EventService
    
  ) { }

  ngOnInit() {
    this.now = new Date();
    this.getData();
  }

  onView(e: FoodEvent): void {
      this.dialogue.open(
        EventDetailsComponent,
        {
          width: '750px',
          data: e
        }
      );
    
  
  }

  go(dir: number): void {
    this.now = addMonths(this.now, dir);
    this.getData();
  }

  reset(): void {
    this.now = new Date();
    this.getData();
  }

  private getData(): void {
    this.thisMonth = format(this.now, 'MMMM');
    this.lastMonth = format(addMonths(this.now, -1), 'MMMM');
    this.nextMonth = format(addMonths(this.now, 1), 'MMMM');
    this.cards = [];

    const monthStart = setDate(this.now, 1); // day 1 of current month
    const monthEnd = lastDayOfMonth(this.now); // final day of current month
    const dayFirst = startOfWeek(monthStart); // the date of the Sunday leading into the current month
    const dayLast = endOfWeek(monthEnd); // the date of the Saturday on or after the end of the month
    const dates = eachDayOfInterval({ start: dayFirst, end: dayLast }); // every single date in between the start and end
    let rawEvents: FoodEvent[];
    let events: Event[];

    this.eventService.getAll().subscribe(
      (evts: FoodEvent[]) => {
        evts = evts.filter(e => e.event_date >= dayFirst && e.event_date <= dayLast);
        // loop over every date on the grid
        this.cards = dates.map((d: Date) => {
          // get all the events from your database query for each date on the grid
          rawEvents = evts.filter(
            evt => isWithinInterval(d, { start: startOfDay(new Date(evt.food_start_time)), end: endOfDay(new Date(evt.food_end_time)) })
          );
          // this is just a limit to show no more than 3 events by default on a given date
          events = rawEvents.slice(0, 2).map(evt => this.getEvent(d, evt));

          return {
            day: d,
            title: format(d, 'MMM d'),
            cols: 1,
            rows: 1,
            rawEvents,
            events: events.length ? events : null,
            moreColor: (rawEvents.length > 2) ? 'accent' : 'primary',
            todayColor: isSameDay(d, new Date()) ? 'accent' : ''
          };
        });
      }
    );
  }

  private readonly getEvent = (d: Date, evt: FoodEvent): Event => {
    const e: Event = { calendarEvent: evt, times: '' };
    const startsToday = isSameDay(d, new Date(evt.food_start_time));
    const endsToday = isSameDay(d, new Date(evt.food_end_time));
    let times = '';

    if (startsToday) {
      times = (endsToday ? '' : 'starts @ ') + format(new Date(evt.food_start_time), 'h:mm a');
    }
    if (endsToday) {
      times += (startsToday ? '\u2013' : 'ends @ ') + format(new Date(evt.food_end_time), 'h:mm a');
    }

    e.times = times;

    return e;
  };
}