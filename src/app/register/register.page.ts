import { AngularFirestore } from '@angular/fire/firestore';
import { User } from './../shared/user.types';
import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  constructor(
    private navCtrl: NavController,
    private afAuth: AngularFireAuth,
    private db: AngularFirestore,
  ) {}

  public user: User = new User();

  ngOnInit() {}

  public register(): void {
    this.afAuth.auth
      .setPersistence(firebase.auth.Auth.Persistence.LOCAL)
      .then(() => {
        this.afAuth.auth
          .createUserWithEmailAndPassword(this.user.email, this.user.password)
          .then((user: firebase.auth.UserCredential) => {
            this.createProfile(this.afAuth.auth.currentUser);
            this.navCtrl.navigateRoot('login');
          })
          .catch((error: any) => {
            console.error(error);
          });
      });
  }

  public createProfile(userRecord: firebase.User): void {
    const { email, uid } = userRecord;
    this.db
      .collection('users')
      .doc(uid)
      .set({ email });
  }
}
