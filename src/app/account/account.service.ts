import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';


export interface UserDetails {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  displayName: string;
  phone: string;
  notify_by_email: boolean;
  notify_by_text: boolean;
  gluten_free: boolean;
  halal: boolean;
  kosher: boolean;
  vegetarian: boolean
  vegan: boolean;
  date_created: Date;
  date_modified: Date;
  banner_id: string;
  is_admin: boolean;
}
@Injectable({
  providedIn: 'root'
})
export class AccountService{
  private server = environment.server;

  constructor(private http: HttpClient) { }

  getAll(): Observable<UserDetails[]> {
    return this.http.get<UserDetails[]>(`${this.server}/api/core/users`);
  }
}
