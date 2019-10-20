import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { User } from '../shared/user.types';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  constructor(
    private navCtrl: NavController,
    private afAuth: AngularFireAuth,
  ) {}

  public user: User = new User();

  ngOnInit() {}

  public login(): void {
    this.afAuth.auth
      .signInWithEmailAndPassword(this.user.email, this.user.password)
      .then((user: firebase.auth.UserCredential) => {
        this.navCtrl.navigateRoot('');
      })
      .catch((error: any) => {
        console.error(error);
      });
  }
}
