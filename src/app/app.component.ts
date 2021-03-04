import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase';
import { Subscription } from 'rxjs';

import { AuthService } from './services/auth.service';
import { FlexMessage, MessageService } from './services/message.service';

import { Dialog, DialogComponent } from './shared/dialog.component';

import { RegisterComponent } from './views/register.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit, OnDestroy {
  isLoggedIn = false;
  isVerified = false;
  private subscription: Subscription;

  constructor(
    public dialog: MatDialog,
    public snack: MatSnackBar,
    private readonly firebaseAuth: AngularFireAuth,
    private readonly authService: AuthService,
    private readonly msgService: MessageService
  ) { }

  ngOnInit(): void {
    this.subscription = this.firebaseAuth.authState.subscribe((user: firebase.User) => {
      this.isLoggedIn = !!user;
      if (this.isLoggedIn) {
        this.isVerified = user.emailVerified;
      }
    });
    this.subscription.add(this.msgService.push.subscribe(
      (msg: FlexMessage) => {
        if (msg) {
          if (msg.success) {
            this.snack.open(msg.message, 'Got it!', { duration: 5000 });
          } else {
            this.openDialog(msg.title, msg.message);
          }
        }
      }
    ));
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  onLogout(): void {
    this.authService.logout();
  }

  onRegister(): void {
    this.dialog.open(
      RegisterComponent,
      {
        width: '500px'
      }
    );
  }

  private openDialog(ttl: string, msg: string): void {
    const data: Dialog = {
      title: ttl,
      content: msg
    };
    this.dialog.open(
      DialogComponent,
      {
        width: '400px',
        data
      }
    );
  }
}
