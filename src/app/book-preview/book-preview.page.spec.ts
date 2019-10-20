import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BookPreviewPage } from './book-preview.page';

describe('BookPreviewPage', () => {
  let component: BookPreviewPage;
  let fixture: ComponentFixture<BookPreviewPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookPreviewPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookPreviewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
