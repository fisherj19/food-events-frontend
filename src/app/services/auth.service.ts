import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { Message } from './message.service';
import { AccountService, UserDetails } from '../account/account.service';

interface FBAuthUser {
  email: string;
  displayName: string;
  phoneNumber: string;
  password?: string;
  photoUrl: string;
  emailVerified: boolean;
  uid: string;
  token: string;
  admin: boolean;
  deleted: boolean;
  banned: boolean;

}

export interface User extends FBAuthUser{
  bannerID: string;
  isAdmin: boolean;
  first_name: string;
  last_name: string;
}

interface AdminCheck {
  is_admin: boolean;
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
  profile: UserDetails;
  fullUser: User;
  
  // store the URL to redirect to after login
  redirectURL = '/home';
  private server = environment.server;
  private fbUser: firebase.User;
  private readonly emptyUser: FBAuthUser = {
    email: '',
    displayName: '',
    phoneNumber: '',
    photoUrl: '',
    emailVerified: false,
    uid: '',
    token: '',
    admin: false,
    deleted: false,
    banned: false,
    
  };

  constructor(
    private readonly http: HttpClient,
    private readonly router: Router,
    private readonly firebaseAuth: AngularFireAuth,
    private readonly accountService: AccountService
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
            phoneNumber: user.phoneNumber,
            photoUrl: user.photoURL,
            emailVerified: user.emailVerified,
            uid: user.uid,
            token: '',
            admin: false,
            deleted: false,
            banned: false
          };
          this.accountService.getByID(user.uid).subscribe((user: UserDetails) => this.profile = user);

          user.getIdTokenResult().then((t: firebase.auth.IdTokenResult) => {
            this.u.token = t.token;
            /* let's assume these are not getting set in Firebase, so we'll deal with them from the database:
            this.u.admin = !!t.claims.admin;
            this.u.deleted = !!t.claims.deleted;
            this.u.banned = !!t.claims.banned;
            */
            //get the rest of the user info from the database
            //this.http.get<User>(`${this.server}/api/user/${this.u.uid}`).subscribe(dbUser => {
             // this.fullUser = {
            //    ...this.u,
             //   firstName: dbUser.firstName,
            //    lastName: dbUser.lastName,
            //    bannerID: dbUser.bannerID,
            //    phoneNumber: dbUser.phoneNumber,
             //   isAdmin: dbUser.isAdmin
             // };
           // });
          });
        } else {
          // user is not logged in, so reset
          this.fbUser = null;
          this.u = this.emptyUser;
        }
      }
    );
  }

  async createRegular(reg: FBAuthUser): Promise<Message>
  async createRegular(reg: User): Promise<Message> {
    const msg: Message = { success: false, message: '' };

    if (reg.email.split('@')[1].toLowerCase() !== 'xavier.edu') {
      msg.message = 'This application can only be accessed by valid Xavier University email addresses.';
      return msg;
    }

    try {
      const u = await this.firebaseAuth.createUserWithEmailAndPassword(reg.email, reg.password);
      try {
        await u.user.updateProfile({ displayName: reg.displayName, photoURL: ''});
        msg.message = 'You have been registered successfully.';
        this.http.post(`${this.server}/api/user`, JSON.stringify(reg)).subscribe(); // this inserts into the database
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
    const params: AuthParams = {
      token: this.u.token,
      username: this.u.email,
      key: this.u.uid
    };

    return params;
  }

  isAdmin(): Observable<boolean> {
    return this.http.get<AdminCheck>(`${this.server}/api/core/check_admin`).pipe(
      map(check => check.is_admin)
    );
  }

  logout(): void {
    this.redirectURL = '/home';
    this.firebaseAuth.signOut().then(() => this.router.navigate(['/home']));
  }

  signInWithEmail(email: string, password: string, ): Promise<any> {
    return this.firebaseAuth.signInWithEmailAndPassword(email, password);
  }

  async update(name: string, photoUrl: string, user: UserDetails): Promise<Message> {
    const msg: Message = { success: false, message: '' };

    user = {

      first_name: user.first_name,
      last_name: user.last_name,
      banner_id: user.banner_id,
      displayName: name,
      phone: user.phone,
    
      gluten_free: user.gluten_free,
      halal: user.halal,
      kosher: user.kosher,
      vegetarian: user.vegetarian,
      vegan: user.vegan,
      dairy_allergy: user.dairy_allergy,
      egg_allergy: user.egg_allergy,
      gluten_allergy: user.gluten_allergy,
      nut_allergy: user.nut_allergy,
      shellfish_allergy: user.shellfish_allergy,
      
      //useless ones
      id: user.id,
      email: user.email,
      notify_by_email: user.notify_by_email,
      notify_by_text: user.notify_by_text,
      date_created: user.date_created,
      date_modified: user.date_modified,
      is_admin: user.is_admin,
    }

    try {
      await this.fbUser.updateProfile({
        displayName: name,
        photoURL: photoUrl,
  
      });

      

      this.http.put(`${this.server}/api/user/update`, JSON.stringify(user)).subscribe();
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
