import { AuthService } from './../shared/auth.service';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-settings',
  templateUrl: 'settings.page.html',
  styleUrls: ['settings.page.scss'],
})
export class SettingsPage {
  constructor(private authService: AuthService, private router: Router) {}

  public signOut(): void {
    this.authService.signOut();
    this.router.navigate(['login']);
  }
}
