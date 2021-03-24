import { Component, OnInit } from '@angular/core';
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
    private accountService: AccountService
  ) { }

  ngOnInit(): void {
    this.isAdmin = this.authService.isAdmin();
    this.accountService.getAll().subscribe(user => {
      this.user = user;
  });

}}
