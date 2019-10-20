import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from './../shared/auth.service';
import { Component } from '@angular/core';
import { NavController, ToastController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { User } from '../shared/user.types';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  constructor(
    private navController: NavController,
    private afAuth: AngularFireAuth,
    private authService: AuthService,
    private toastController: ToastController,
    private fb: FormBuilder,
  ) {}

  public form: FormGroup;
  public user: User = new User();

  ionViewDidEnter(): void {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  async presentToast(): Promise<any> {
    const toast = await this.toastController.create({
      message: `A password reset email has been sent to ${this.user.email}`,
      duration: 2000,
      color: 'dark',
    });
    toast.present();
  }

  public login(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { email, password } = this.form.value;

    this.afAuth.auth
      .signInWithEmailAndPassword(email, password)
      .then((user: firebase.auth.UserCredential) => {
        this.navController.navigateRoot('');
      })
      .catch((error: any) => {
        console.error(error);
      });
  }

  public forgotPassword(): void {
    if (!this.form.value.email) {
      this.form.get('email').markAsTouched();
      return;
    }
    this.authService.resetPassword(this.user.email).then(res => {});
  }
}
