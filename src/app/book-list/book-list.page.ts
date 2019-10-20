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
  private ngUnsubscribe = new Subject();

  ionViewDidEnter(): void {
    this.authService
      .getAuthState()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((user: firebase.User) => {
        if (user) {
          this.getAllBooks(user.uid);
        } else {
          this.navController.navigateRoot(['login']);
        }
      });
  }

  ionViewDidLeave(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  public getAllBooks(userId: string): void {
    this.booksService
      .getAllBooks(userId)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        (books: IBook[]) => {
          this.books = books;
        },
        error => console.error,
      );
  }

  public navigateToSearch(): void {
    this.navController.navigateForward(['search']);
  }

  public navigateToSettings(): void {
    this.navController.navigateForward(['settings']);
  }
}
