import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddRecommendationPage } from './add-recommendation.page';

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, IonicModule],
  declarations: [AddRecommendationPage],
  entryComponents: [AddRecommendationPage],
  exports: [AddRecommendationPage],
})
export class AddRecommendationPageModule {}
