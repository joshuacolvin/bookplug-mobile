import { AuthService } from './../shared/auth.service';
import { BooksService } from './../shared/books.service';
import { IBook, IBookPreview, IBookPost } from './../shared/book.types';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-book-preview',
  templateUrl: './book-preview.page.html',
  styleUrls: ['./book-preview.page.scss'],
})
export class BookPreviewPage implements OnInit {
  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private bookService: BooksService,
    private authService: AuthService,
    private toastController: ToastController,
  ) {}

  public book: IBookPreview;
  public uid: string;

  ngOnInit() {
    this.authService.getAuthState().subscribe((user: firebase.User) => {
      if (user) {
        this.uid = user.uid;
        const volumeId: string = this.route.snapshot.queryParamMap.get(
          'bookId',
        );

        this.getBookByVolumeId(volumeId);
      } else {
        this.router.navigate(['login']);
      }
    });
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Book added',
      duration: 2000,
    });
    toast.present();
  }

  public addBook(): void {
    delete this.book.description;

    const bookToAdd: IBookPost = {
      ...this.book,
      authors: this.book.authors.join(', '),
      uid: this.uid,
    };

    this.bookService.addBook(bookToAdd).subscribe(
      (book: IBook) => {
        this.presentToast();
        this.router.navigate([`books/${book.id}`]);
      },
      error => console.error,
    );
  }

  public getBookByVolumeId(volumeId: string): void {
    this.http
      .get(`https://www.googleapis.com/books/v1/volumes/${volumeId}`)
      .subscribe((book: any) => {
        const { authors, title, imageLinks, description } = book.volumeInfo;

        this.book = {
          id: book.id,
          authors,
          title,
          thumbnailUrl: imageLinks.smallThumbnail,
          description,
        };
      });
  }
}
