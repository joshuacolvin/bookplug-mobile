import { Component, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { IonSearchbar, NavController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage {
  constructor(
    private http: HttpClient,
    private keyboard: Keyboard,
    private navController: NavController,
  ) {}

  @ViewChild('autofocus', { static: false }) searchbar: IonSearchbar;

  public searchResults: any;

  private ngUnsubscribe: Subject<any> = new Subject();

  ionViewDidEnter(): void {
    setTimeout(() => this.searchbar.setFocus(), 500);
  }

  ionViewDidLeave(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  public onSearch(event: any): void {
    this.http
      .get(
        `https://www.googleapis.com/books/v1/volumes?q=${event.target.value}`,
      )
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        (res: any) => {
          this.searchResults = res.items;
        },
        error => console.error,
      );
  }

  public closeKeyboard(): void {
    this.keyboard.hide();
  }

  public openBookPreview(bookId: string): void {
    this.navController.navigateForward(['book-preview'], {
      queryParams: { bookId },
    });
  }

  public clearSearch(): void {
    this.searchResults = null;
  }
}
