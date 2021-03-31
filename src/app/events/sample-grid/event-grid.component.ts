import { Component, OnDestroy, OnInit } from '@angular/core';
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

import { CalendarService, CalendarEvent } from '../../services/calendar.service';

interface Event {
  calendarEvent: CalendarEvent;
  times: string;
}

interface EventCard {
  day: Date;
  title: string;
  cols: number;
  rows: number;
  rawEvents: CalendarEvent[];
  events: Event[];
  moreColor: string;
  todayColor: string;
}

export interface DayData {
  day: Date;
  events: CalendarEvent[];
}

@Component({
  templateUrl: './event-grid.component.html',
  styleUrls: ['./event-grid.component.scss']
})
export class EventGridComponent implements OnInit, OnDestroy {
  thisMonth: string;
  lastMonth: string;
  nextMonth: string;
  cards: EventCard[];
  private now: Date;

  constructor(
    private readonly calendarService: CalendarService
  ) { }

  ngOnInit() {
    this.now = new Date();
    this.getData();
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
    let rawEvents: CalendarEvent[];
    let events: Event[];

    this.calendarService.getByRange(dayFirst, dayLast).subscribe(
      (evts: CalendarEvent[]) => {
        // loop over every date on the grid
        this.cards = dates.map((d: Date) => {
          // get all the events from your database query for each date on the grid
          rawEvents = evts.filter(
            evt => isWithinInterval(d, { start: startOfDay(new Date(evt.StartTime)), end: endOfDay(new Date(evt.EndTime)) })
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

  private readonly getEvent = (d: Date, evt: CalendarEvent): Event => {
    const e: Event = { calendarEvent: evt, times: '' };
    const startsToday = isSameDay(d, new Date(evt.StartTime));
    const endsToday = isSameDay(d, new Date(evt.EndTime));
    let times = '';

    if (startsToday) {
      times = (endsToday ? '' : 'starts @ ') + format(new Date(evt.StartTime), 'h:mm a');
    }
    if (endsToday) {
      times += (startsToday ? '\u2013' : 'ends @ ') + format(new Date(evt.EndTime), 'h:mm a');
    }

    e.times = times;

    return e;
  };
}
