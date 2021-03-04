import { NgModule } from '@angular/core';
import { AngularFireAuthGuard } from '@angular/fire/auth-guard';
import { Routes, RouterModule } from '@angular/router';
import { map } from 'rxjs/operators';

import { HomeComponent } from './views/home.component';
import { LoginComponent } from './views/login.component';
import { VerifyComponent } from './views/verify.component';

const notLoggedIn = () => map(user => user ? ['home'] : true);

const routes: Routes = [
  { path: 'events', loadChildren: () => import('./events/events.module').then(m => m.EventsModule) },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent, canActivate: [AngularFireAuthGuard], data: { authGuardPipe: notLoggedIn } },
  { path: 'verify', component: VerifyComponent, canActivate: [AngularFireAuthGuard], data: { authGuardPipe: !notLoggedIn } },
  { path: '', redirectTo: 'home', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
