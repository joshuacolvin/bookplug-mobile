import { Component, ViewChild, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { Router } from '@angular/router';
import { IonSearchbar } from '@ionic/angular';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {
  constructor(
    private http: HttpClient,
    private keyboard: Keyboard,
    private router: Router,
  ) {}

  @ViewChild('autofocus', { static: false }) searchbar: IonSearchbar;

  public searchResults: any;

  ngOnInit(): void {
    setTimeout(() => this.searchbar.setFocus(), 500);
  }

  public onSearch(event: any): void {
    this.http
      .get(
        `https://www.googleapis.com/books/v1/volumes?q=${event.target.value}`,
      )
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

  public openBookPreview(id: string): void {
    this.router.navigate(['book-preview'], { queryParams: { bookId: id } });
  }

  public clearSearch(): void {
    this.searchResults = null;
  }
}
