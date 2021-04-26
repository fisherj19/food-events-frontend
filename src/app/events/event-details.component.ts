import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FoodEvent } from './event.service';

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
  glutenFree: boolean;
  halal: boolean;
  kosher: boolean;
  vegetarian: boolean;
  vegan: boolean;

  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<EventDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) private readonly data: FoodEvent
  ) { }

  ngOnInit(): void {
    this.name = this.data.event_name;
    this.description = this.data.event_desc;
    this.date = this.data.event_date;
    this.startTime = this.data.food_start_time;
    this.endTime = this.data.food_end_time;
    this.location = this.data.event_location;
    this.glutenFree = this.data.gluten_free;
    this.halal = this.data.halal;
    this.kosher = this.data.kosher;
    this.vegetarian = this.data.vegetarian;
    this.vegan = this.data.vegan;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  
}
