import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ToastController, NavController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AuthService } from './../shared/auth.service';
import { BooksService } from './../shared/books.service';
import { IBook, IBookPreview } from './../shared/book.types';

@Component({
  selector: 'app-book-preview',
  templateUrl: './book-preview.page.html',
  styleUrls: ['./book-preview.page.scss'],
})
export class BookPreviewPage {
  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private navController: NavController,
    private bookService: BooksService,
    private authService: AuthService,
    private toastController: ToastController,
  ) {}

  public book: IBookPreview;
  public uid: string;

  private ngUnsubscribe: Subject<any> = new Subject();

  ionViewDidEnter(): void {
    this.authService
      .getAuthState()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((user: firebase.User) => {
        if (user) {
          this.uid = user.uid;
          const volumeId: string = this.route.snapshot.queryParamMap.get(
            'bookId',
          );

          this.getBookByVolumeId(volumeId);
        } else {
          this.navController.navigateRoot(['login']);
        }
      });
  }

  ionViewDidLeave(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  async presentToast(): Promise<any> {
    const toast = await this.toastController.create({
      message: 'Book added',
      duration: 2000,
      color: 'dark',
    });
    toast.present();
  }

  public addBook(): void {
    delete this.book.description;

    const bookToAdd: IBook = {
      ...this.book,
      authors: this.book.authors.join(', '),
      uid: this.uid,
    };

    this.bookService
      .addBook(bookToAdd)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        (book: IBook) => {
          this.presentToast();
          this.navController.navigateForward([`books/${book.id}`]);
        },
        error => console.error,
      );
  }

  public getBookByVolumeId(volumeId: string): void {
    this.http
      .get(`https://www.googleapis.com/books/v1/volumes/${volumeId}`)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((book: any) => {
        const { authors, title, imageLinks, description } = book.volumeInfo;

        this.book = {
          googleId: book.id,
          authors,
          title,
          thumbnailUrl: imageLinks.smallThumbnail,
          description,
        };
      });
  }
}
