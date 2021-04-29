import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../services/auth.service';
import { AccountService, UserDetails } from './account.service';
import { ProfileEditorComponent } from '../profile-editor/profile-editor.component';



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
    public dialog: MatDialog,
    
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

    this.AccountService.getByID(this.authService.u.email).subscribe(user => {
    this.currentUser = user; 
    this.ready = true;});    

  } 

  editProfile(): void {
    this.dialog.open(
      ProfileEditorComponent,
      {
        width: '500px'
      }
    );
  }

  



}
