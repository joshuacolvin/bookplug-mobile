import { AddRecommendationPage } from './../add-recommendation/add-recommendation.page';
import { AddRecommendationPageModule } from './../add-recommendation/add-recommendation.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { BookDetailPage } from './book-detail.page';

const routes: Routes = [
  {
    path: '',
    component: BookDetailPage,
  },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    AddRecommendationPageModule,
  ],
  declarations: [BookDetailPage],
  entryComponents: [AddRecommendationPage],
})
export class BookDetailPageModule {}
