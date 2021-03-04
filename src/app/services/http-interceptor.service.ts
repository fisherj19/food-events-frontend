import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase/app';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, filter, switchMap, finalize } from 'rxjs/operators';

import { AuthParams, AuthService } from './auth.service';

@Injectable()
export class HttpAuthInterceptor implements HttpInterceptor {
  private authParams: AuthParams;
  private refreshAuthInProgress = false;
  private readonly refreshAuthSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(private readonly firebaseAuth: AngularFireAuth, private readonly authService: AuthService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // tslint:disable-next-line: object-literal-key-quotes
    req = req.clone({ setHeaders: { 'content-type': 'application/json', 'akey': '218' } });

    req = this.addAuthParams(req);

    return next.handle(req).pipe(
      // tslint:disable-next-line: variable-name
      catchError((error: HttpErrorResponse, _caught) => {
        if (error && error.status === 401) {
          // 401 is due to expired or invalid auth params, so refresh
          let rtn: Observable<HttpEvent<any>>;
          if (this.refreshAuthInProgress) {
            // if refreshAuthInProgress is true, wait until refreshAuthSubject has a non-null value to retry
            rtn = this.refreshAuthSubject.pipe(
              filter(result => result !== null),
              switchMap(() => next.handle(this.addAuthParams(req)))
            );
          } else {
            this.refreshAuthInProgress = true;
            // set refreshAuthSubject to null so that subsequent API calls will wait until the new auth params have been retrieved
            this.refreshAuthSubject.next(null);

            rtn = this.refreshAuthParams().pipe(
              switchMap((user: firebase.User) => {
                this.refreshAuthSubject.next(!!(user && user.emailVerified));
                return next.handle(this.addAuthParams(req));
              }),
              // when the call to refreshAuthParams completes, reset refreshAuthInProgress to false
              finalize(() => this.refreshAuthInProgress = false)
            );
          }

          return rtn;
        }

        return throwError(error);
      })
    );
  }

  private addAuthParams(request: HttpRequest<any>): HttpRequest<any> {
    // don't add auth params to public routes
    if (!request.url.match(/\/api\/core\//)) {
      return request;
    }
    this.authParams = this.authService.getParams();
    // don't add auth params if they don't exist yet
    if (this.authParams.token === '') {
      return request;
    }
    // add the auth params to the headers
    return request.clone({ setHeaders: { ...this.authParams } });
  }

  private refreshAuthParams(): Observable<firebase.User> {
    // subscribe to the Firebase AuthState to see if the auth params can be set
    return this.firebaseAuth.authState;
  }
}
