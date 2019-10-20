import { BooksService } from './../shared/books.service';
import { IBook, IRecommendation } from './../shared/book.types';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController, ToastController } from '@ionic/angular';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-add-recommendation',
  templateUrl: './add-recommendation.page.html',
  styleUrls: ['./add-recommendation.page.scss'],
})
export class AddRecommendationPage implements OnInit {
  constructor(
    private modalController: ModalController,
    private fb: FormBuilder,
    private bookService: BooksService,
    private toastController: ToastController,
  ) {}

  @Input() book: IBook;
  @Input() recommendation: IRecommendation;

  public form: FormGroup;

  ngOnInit() {
    this.form = this.fb.group({
      source: [
        this.recommendation ? this.recommendation.source : '',
        Validators.required,
      ],
      url: [this.recommendation ? this.recommendation.url : ''],
    });
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Recommendation added',
      duration: 2000,
    });
    toast.present();
  }

  public dismissModal() {
    this.modalController.dismiss({
      dismissed: true,
    });
  }

  public addRecommendation() {
    if (this.form.invalid) {
      return;
    }

    this.bookService.addRecommendation(this.book.id, this.form.value).subscribe(
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
      .subscribe(
        () => {
          this.dismissModal();
        },
        error => console.error,
      );
  }
}
