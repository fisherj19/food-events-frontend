import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase';

import { Message } from './message.service';

interface FBAuthUser {
  email: string;
  displayName: string;
  password?: string;
  photoUrl: string;
  emailVerified: boolean;
  uid: string;
  token: string;
  admin: boolean;
  deleted: boolean;
  banned: boolean;
}

export interface AuthParams {
  token: string;
  username: string;
  key: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  u: FBAuthUser;
  // store the URL to redirect to after login
  redirectURL = '/home';
  private fbUser: firebase.User;
  private readonly emptyUser: FBAuthUser = {
    email: '',
    displayName: '',
    photoUrl: '',
    emailVerified: false,
    uid: '',
    token: '',
    admin: false,
    deleted: false,
    banned: false
  };

  constructor(
    private readonly router: Router,
    private readonly firebaseAuth: AngularFireAuth
  ) {
    this.u = this.emptyUser;
    firebaseAuth.onAuthStateChanged(
      (user: firebase.User) => {
        if (user) {
          // user is logged in
          this.fbUser = user;
          this.u = {
            email: user.email,
            displayName: user.displayName,
            photoUrl: user.photoURL,
            emailVerified: user.emailVerified,
            uid: user.uid,
            token: '',
            admin: false,
            deleted: false,
            banned: false
          };
          user.getIdTokenResult().then((t: firebase.auth.IdTokenResult) => {
            this.u.token = t.token;
            this.u.admin = !!t.claims.admin;
            this.u.deleted = !!t.claims.deleted;
            this.u.banned = !!t.claims.banned;
          });
        } else {
          // user is not logged in, so reset
          this.fbUser = null;
          this.u = this.emptyUser;
        }
      }
    );
  }

  async createRegular(reg: FBAuthUser): Promise<Message> {
    const msg: Message = { success: false, message: '' };

    if (reg.email.split('@')[1].toLowerCase() !== 'xavier.edu') {
      msg.message = 'This application can only be accessed by valid Xavier University email addresses.';
      return msg;
    }

    try {
      const u = await this.firebaseAuth.createUserWithEmailAndPassword(reg.email, reg.password);
      try {
        await u.user.updateProfile({ displayName: reg.displayName, photoURL: '' });
        msg.message = 'You have been registered successfully.';
        try {
          await this.verify();
          msg.success = true;
          msg.message += ' Please look for your verification email!';
          return msg;
        } catch (err) {
          msg.message += ` There was a problem sending your verification email. ${err.message}`;
          return msg;
        }
      } catch (error) {
        msg.message += ` There was a problem getting everything set up. Please try to login. ${error.message}`;
        return msg;
      }
    } catch (e) {
      msg.message = e.message;
      return msg;
    }
  }

  getParams(): AuthParams {
    return {
      token: this.u.token,
      username: this.u.email,
      key: this.u.uid
    };
  }

  logout(): void {
    this.redirectURL = '/home';
    this.firebaseAuth.signOut().then(() => this.router.navigate(['/home']));
  }

  signInWithEmail(email: string, password: string): Promise<any> {
    return this.firebaseAuth.signInWithEmailAndPassword(email, password);
  }

  async update(name: string, photoUrl: string): Promise<Message> {
    const msg: Message = { success: false, message: '' };

    try {
      await this.fbUser.updateProfile({
        displayName: name,
        photoURL: photoUrl
      });
      msg.success = true;
      msg.message = 'Your account has been updated successfully.';
      return msg;
    } catch (e) {
      msg.message = e.message;
      return msg;
    }
  }

  verify(): Promise<any> {
    return this.fbUser.sendEmailVerification();
  }
}
