import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EventsComponent } from './events.component';

import { EventsRoutingModule } from './events-routing.module';
import { EventDetailsComponent } from './event-details.component';

@NgModule({
  declarations: [
    EventsComponent,
    EventDetailsComponent
  ],
  imports: [
    CommonModule,
    EventsRoutingModule
  ]
})
export class EventsModule { }
