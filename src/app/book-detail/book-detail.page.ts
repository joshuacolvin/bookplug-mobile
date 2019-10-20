import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  AlertController,
  ModalController,
  IonItemSliding,
  ActionSheetController,
  ToastController,
  NavController,
} from '@ionic/angular';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AddRecommendationPage } from './../add-recommendation/add-recommendation.page';
import { BooksService } from './../shared/books.service';
import { IBook, IRecommendation } from './../shared/book.types';
import { AuthService } from './../shared/auth.service';

@Component({
  selector: 'app-book-detail',
  templateUrl: './book-detail.page.html',
  styleUrls: ['./book-detail.page.scss'],
})
export class BookDetailPage {
  constructor(
    private route: ActivatedRoute,
    private booksService: BooksService,
    private iab: InAppBrowser,
    private navController: NavController,
    private alertController: AlertController,
    private modalController: ModalController,
    private actionSheetController: ActionSheetController,
    private toastController: ToastController,
    private authService: AuthService,
  ) {}

  @ViewChild(IonItemSliding, { static: true }) slidingItem: IonItemSliding;

  public book: IBook;
  public recommendations: IRecommendation[];
  public uid: string;

  private ngUnsubscribe: Subject<any> = new Subject();

  ionViewDidEnter(): void {
    const bookId: string = this.route.snapshot.paramMap.get('id');

    this.authService
      .getAuthState()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((user: firebase.User) => {
        if (user) {
          this.uid = user.uid;
          this.getBook(bookId);
        } else {
          this.navController.navigateRoot(['login']);
        }
      });
  }

  ionViewDidLeave(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  async presentActionSheet(): Promise<any> {
    const actionSheet = await this.actionSheetController.create({
      header: 'Book',
      buttons: [
        {
          text: 'Delete',
          role: 'destructive',
          handler: () => {
            this.deleteBook();
          },
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            actionSheet.dismiss();
          },
        },
      ],
    });
    await actionSheet.present();
  }

  async presentDeleteRecommendationConfirm(
    slidingItem: IonItemSliding,
    recommendationId: string,
  ): Promise<any> {
    const alert = await this.alertController.create({
      header: 'Delete recommendation?',
      message: `Are you sure you want to delete this recommendation?`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            return;
          },
        },
        {
          text: 'Delete',
          handler: () => {
            this.removeRecommendation(recommendationId);
          },
        },
      ],
    });

    alert.onDidDismiss().then(() => {
      setTimeout(() => {
        slidingItem.close();
      }, 1);
    });

    await alert.present();
  }

  async presentAddEditModal(
    slidingItem: IonItemSliding,
    recommendation?: IRecommendation,
  ): Promise<any> {
    const modal = await this.modalController.create({
      component: AddRecommendationPage,
      componentProps: {
        book: this.book,
        recommendation,
        uid: this.uid,
      },
    });

    modal.onDidDismiss().then(() => {
      if (slidingItem) {
        setTimeout(() => {
          slidingItem.close();
        }, 1);
      }
    });

    return await modal.present();
  }

  async presentToast(message: string): Promise<any> {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
    });
    toast.present();
  }

  public deleteBook(): void {
    this.booksService
      .deleteBook(this.book.id)
      .then(() => {
        this.presentToast('Book deleted');
        this.navController.navigateRoot(['books']);
      })
      .catch(error => console.error);
  }

  public getBook(bookId: string): void {
    this.booksService
      .getBookById(bookId)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        (book: IBook) => {
          this.book = book;

          if (this.book) {
            this.getRecommendations(this.book.id);
          }
        },
        error => console.error,
      );
  }

  public getRecommendations(bookId: string): void {
    this.booksService
      .getAllRecommendationsForBook(bookId)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        (recommendations: IRecommendation[]) => {
          this.recommendations = recommendations;
        },
        error => console.error,
      );
  }

  public openSourceUrl(url?: string): void {
    if (!url) {
      return;
    }

    this.iab.create(url, '_system');
  }

  public removeRecommendation(recommendationId: string): void {
    this.booksService
      .removeRecommendation(this.book.id, recommendationId)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        (recommendations: IRecommendation[]) => {
          this.recommendations = recommendations;
          this.presentToast('Recommendation removed');
        },
        error => console.error,
      );
  }

  public navigateToSettings(): void {
    this.navController.navigateForward(['settings']);
  }

  public navigateToBooks(): void {
    this.navController.navigateBack(['books']);
  }
}
