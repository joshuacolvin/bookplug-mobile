import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRecommendationPage } from './add-recommendation.page';

describe('AddRecommendationPage', () => {
  let component: AddRecommendationPage;
  let fixture: ComponentFixture<AddRecommendationPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddRecommendationPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddRecommendationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
