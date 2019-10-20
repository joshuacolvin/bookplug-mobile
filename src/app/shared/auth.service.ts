import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { Injectable } from '@angular/core';

@Injectable()
export class AuthService {
  // tslint:disable-next-line:variable-name
  private _user: firebase.User;

  constructor(public afAuth: AngularFireAuth) {
    afAuth.authState.subscribe((user: firebase.User) => {
      this.user = user;
    });
  }

  get user(): firebase.User {
    return this._user;
  }

  set user(value: firebase.User) {
    this._user = value;
  }

  get authenticated(): boolean {
    return !!this._user;
  }

  get id(): string {
    return this.authenticated ? this.user.uid : '';
  }

  public getAuthState(): Observable<firebase.User> {
    return this.afAuth.authState;
  }

  public signOut(): void {
    this.afAuth.auth.signOut();
  }
}
