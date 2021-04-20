/*
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FoodEvent } from './event.service';

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.component.html',
  styles: [
  ]
})
export class EventDetailsComponent implements OnInit {
  name: string;
  description: string;
  date: Date;
  startTime: Date;
  endTime: Date;
  location: string;
  gluten_free: boolean;
  halal: boolean;
  kosher: boolean;
  vegetarian: boolean;
  vegan: boolean;

  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<EventDetailsComponent>,
    public e: FoodEvent
  ) { }

  ngOnInit(): void {
    this.name = this.e.event_name;
    this.description = this.e.event_desc;
    this.date = this.e.event_date;
    this.startTime = this.e.food_start_time;
    this.endTime = this.e.food_end_time;
    this.location = this.e.event_location;
    this.gluten_free = this.e.gluten_free;
    this.halal = this.e.halal;
    this.kosher = this.e.kosher;
    this.vegetarian = this.e.vegetarian;
    this.vegan = this.e.vegan;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
*/