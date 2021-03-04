import { Component, OnInit, OnDestroy } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import firebase from 'firebase/app';
import { Subscription } from 'rxjs';

import { Dialog, DialogComponent } from '../shared/dialog.component';

import { AuthService } from '../services/auth.service';

@Component({
  templateUrl: './verify.component.html'
})
export class VerifyComponent implements OnInit, OnDestroy {
  private subscription: Subscription;

  constructor(
    public dialog: MatDialog,
    private readonly firebaseAuth: AngularFireAuth,
    private readonly authService: AuthService,
    private readonly router: Router
  ) { }

  ngOnInit() {
    this.subscription = this.firebaseAuth.authState.subscribe(
      (user: firebase.User) => {
        if (!user) {
          this.openDialog('You need to be logged in before trying to verify your email address.', 'Please Login', '/login');
        } else if (user.emailVerified) {
          this.openDialog('Your email address has already been verified, thank you!');
        }
      }
    );
  }

  verify(): void {
    this.authService.verify().then(() => {
      this.openDialog('A verification email has been sent to your address.');
    }).catch(e => {
      this.openDialog(e.message, 'Email Error');
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  private openDialog(msg: string, ttl?: string, path?: string): void {
    if (!ttl) {
      ttl = 'Email Verification';
    }
    if (!path) {
      path = '/home';
    }
    const data: Dialog = {
      title: ttl,
      content: msg
    };
    const dialogRef: MatDialogRef<DialogComponent> = this.dialog.open(
      DialogComponent,
      {
        width: '350px',
        data
      }
    );

    dialogRef.afterClosed().subscribe(() => this.router.navigate([path]));
  }
}
