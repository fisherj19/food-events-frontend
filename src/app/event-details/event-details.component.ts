
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FoodEvent } from '../events/event.service';

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.component.html',
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
    public e: FoodEvent[],
    @Inject(MAT_DIALOG_DATA) private readonly data: FoodEvent[]
  ) { }

  ngOnInit(): void {
    this.name = this.data.e.event_name;
    this.description = this.data.e.event_desc;
    this.date = this.data.e.event_date;
    this.startTime = this.data.e.food_start_time;
    this.endTime = this.data.e.food_end_time;
    this.location = this.data.e.event_location;
    this.gluten_free = this.data.e.gluten_free;
    this.halal = this.data.e.halal;
    this.kosher = this.data.e.kosher;
    this.vegetarian = this.data.e.vegetarian;
    this.vegan = this.data.e.vegan;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
