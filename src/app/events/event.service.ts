import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';

export interface FoodEvent {
  id: string;
  event_creator_id: string;
  event_name: string;
  event_date: Date;
  event_desc: string;
  event_location: string;
  food_desc: string;
  food_start_time: Date;
  food_end_time: Date;
  gluten_free: boolean;
  halal: boolean;
  kosher: boolean;
  vegetarian: boolean;
  vegan: boolean;
  dairy_allergy: boolean;
  egg_allergy: boolean;
  gluten_allergy: boolean;
  nut_allergy: boolean;
  shellfish_allergy: boolean;
  date_closed: Date;
  event_closer_id: string;
  date_created: Date;
  date_modified: Date;
}

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private server = environment.server;

  constructor(private http: HttpClient) { }

  getAll(): Observable<FoodEvent[]> {
    return this.http.get<FoodEvent[]>(`${this.server}/api/core/events`);
  }
  send(): Observable<any> {
    return this.http.post<any>(`${this.server}/api/send`,{});
  }
}
