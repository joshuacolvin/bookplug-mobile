import { NavController } from '@ionic/angular';
import { AuthService } from './../shared/auth.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-settings',
  templateUrl: 'settings.page.html',
  styleUrls: ['settings.page.scss'],
})
export class SettingsPage {
  constructor(
    private authService: AuthService,
    private navController: NavController,
  ) {}

  public signOut(): void {
    this.authService.signOut();
    this.navController.navigateRoot(['login']);
  }
}
