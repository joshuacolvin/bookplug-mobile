import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AuthService } from './../shared/auth.service';
import { BooksService } from './../shared/books.service';
import { IBook } from '../shared/book.types';

@Component({
  selector: 'app-book-list',
  templateUrl: 'book-list.page.html',
  styleUrls: ['book-list.page.scss'],
})
export class BookListPage {
  constructor(
    private booksService: BooksService,
    private authService: AuthService,
    private navController: NavController,
  ) {}

  public books: IBook[];
  public filter = 'most';
  public uid: string;

  private ngUnsubscribe = new Subject();

  ionViewDidEnter(): void {
    this.authService.getAuthState().subscribe((user: firebase.User) => {
      if (user) {
        this.uid = user.uid;
        this.getBooks(this.uid);
      } else {
        this.navController.navigateRoot(['login']);
      }
    });
  }

  ionViewDidLeave(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  public getBooks(uid: string): void {
    if (this.filter === 'most') {
      this.getBooksByMostRecommended(uid);
    }

    if (this.filter === 'newest') {
      this.getAllBooksByDate(uid);
    }
  }

  public getBooksByMostRecommended(userId: string): void {
    this.booksService
      .getAllBooks(userId)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        (books: IBook[]) => {
          this.books = books;
        },
        error => console.log(error),
      );
  }

  public getAllBooksByDate(userId: string): void {
    this.booksService
      .getAllBooksByDate(userId)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        (books: IBook[]) => {
          this.books = books;
        },
        error => console.log(error),
      );
  }

  public segmentChanged(event: any): void {
    this.filter = event.target.value;

    this.getBooks(this.uid);
  }

  public navigateToDetail(book: IBook): void {
    this.navController.navigateForward(['books', book.id]);
  }

  public navigateToSearch(): void {
    this.navController.navigateForward(['search']);
  }

  public navigateToSettings(): void {
    this.navController.navigateForward(['settings']);
  }
}
