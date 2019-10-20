import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController, ToastController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { BooksService } from './../shared/books.service';
import { IBook, IRecommendation } from './../shared/book.types';

@Component({
  selector: 'app-add-recommendation',
  templateUrl: './add-recommendation.page.html',
  styleUrls: ['./add-recommendation.page.scss'],
})
export class AddRecommendationPage {
  constructor(
    private modalController: ModalController,
    private fb: FormBuilder,
    private bookService: BooksService,
    private toastController: ToastController,
  ) {}

  @Input() book: IBook;
  @Input() recommendation: IRecommendation;
  @Input() uid: string;

  public form: FormGroup;

  private ngUnsubscribe: Subject<any> = new Subject();

  ionViewDidEnter(): void {
    this.form = this.fb.group({
      source: [
        this.recommendation ? this.recommendation.source : '',
        Validators.required,
      ],
      url: [this.recommendation ? this.recommendation.url : ''],
      reason: [this.recommendation ? this.recommendation.reason : ''],
      uid: [this.uid],
    });
  }

  ionViewDidLeave(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  async presentToast(): Promise<any> {
    const toast = await this.toastController.create({
      message: 'Recommendation added',
      duration: 2000,
    });
    toast.present();
  }

  public dismissModal(): void {
    this.modalController.dismiss({
      dismissed: true,
    });
  }

  public addRecommendation(): void {
    if (this.form.invalid) {
      return;
    }

    this.bookService
      .addRecommendation(this.book.id, this.form.value)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        () => {
          this.dismissModal();
          this.presentToast();
        },
        error => console.error,
      );
  }

  public editRecommendation(): void {
    if (this.form.invalid) {
      return;
    }

    this.bookService
      .updateRecommendation(
        this.book.id,
        this.recommendation.id,
        this.form.value,
      )
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        () => {
          this.dismissModal();
        },
        error => console.error,
      );
  }
}
