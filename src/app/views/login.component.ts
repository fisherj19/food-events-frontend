import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

import { AuthService } from '../services/auth.service';
import { Dialog, DialogComponent } from '../shared/dialog.component';

import { RegisterComponent } from './register.component';

@Component({
  templateUrl: 'login.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  constructor(
    public dialog: MatDialog,
    private readonly authService: AuthService,
    private readonly formBuilder: FormBuilder,
    private readonly router: Router
  ) { }

  get UserName() { return this.loginForm.get('UserName'); }
  get Password() { return this.loginForm.get('Password'); }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      UserName: ['', [Validators.required, Validators.email, Validators.maxLength(75)]],
      Password: ['', [Validators.required, Validators.maxLength(50)]]
    });
  }

  login(): void {
    const frm = this.loginForm.value;
    const next = this.authService.redirectURL;

    this.authService.signInWithEmail(frm.UserName, frm.Password)
      .then(() => this.router.navigate([next]))
      .catch(err => err.code === 'auth/user-not-found' ? this.onRegister() : this.openDialog(err.message));
  }

  onRegister(): void {
    const frm = this.loginForm.value;

    this.dialog.open(
      RegisterComponent,
      {
        width: '500px',
        data: frm.UserName
      }
    );
  }

  private openDialog(msg: string): void {
    const data: Dialog = {
      title: 'Login Failed',
      content: msg
    };
    this.dialog.open(
      DialogComponent,
      {
        width: '350px',
        data
      }
    );
  }
}
