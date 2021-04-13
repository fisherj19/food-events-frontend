import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
//import { UserInfo, userInfo } from 'node:os';
import { AuthService } from '../services/auth.service';

//import { AuthService } from '../services/auth.service';

import { AccountService, UserDetails } from './account.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styles: [
  ]
})
export class AccountComponent implements OnInit {
  ready = false;
  user: UserDetails[];
  isAdmin = false;
  currentUser: UserDetails;
  

  constructor(
    private authService: AuthService,
    private AccountService: AccountService,
    
  ) { }

  ngOnInit(): void {

    forkJoin([
      this.authService.isAdmin(),
      this.AccountService.getAll()
    ]).subscribe(([isAdmin, user]) => 
    {
      this.isAdmin = isAdmin;
      this.user = user;
      
    })

    //this.currentUser = this.authService.fullUser;
    //this.isAdmin = this.currentUser.isAdmin;
    //this.authService.isAdmin();

    this.AccountService.getByID(this.authService.u.email).subscribe(user => {
    this.currentUser = user; 
    this.ready = true;});    

    //this.AccountService.getAll().subscribe(user => {
     // this.user = user; });

    
    

  } 



}
