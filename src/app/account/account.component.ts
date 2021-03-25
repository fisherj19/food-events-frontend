import { Component, OnInit } from '@angular/core';
//import { forkJoin } from 'rxjs';
import { AuthService } from '../services/auth.service';

import { AccountService, UserDetails } from './account.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styles: [
  ]
})
export class AccountComponent implements OnInit {
  user: UserDetails[];
  isAdmin = false;

  constructor(
    private authService: AuthService,
    private AccountService: AccountService
  ) { }

  ngOnInit(): void {
    this.authService.isAdmin();
    this.AccountService.getAll().subscribe(user => {
      this.user = user; });
    

  }

}
