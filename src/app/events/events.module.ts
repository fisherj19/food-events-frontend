import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EventsComponent } from './events.component';

import { EventsRoutingModule } from './events-routing.module';
import { CalendarComponent } from './calendar/calendar.component';

@NgModule({
  declarations: [
    EventsComponent,
    CalendarComponent
  ],
  imports: [
    CommonModule,
    EventsRoutingModule
  ]
})
export class EventsModule { }
