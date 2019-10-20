import { IBook, IRecommendation } from './book.types';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument,
} from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root',
})
export class BooksService {
  constructor(private db: AngularFirestore, private afAuth: AngularFireAuth) {}

  get currentUser() {
    return this.afAuth.auth.currentUser;
  }

  // Book Actions
  public addBook(book: IBook): Observable<IBook> {
    const booksCollection = this.db.collection<IBook>('books');

    const id: string = this.db.createId();

    book.created = firebase.firestore.FieldValue.serverTimestamp();
    book.recommendationCount = firebase.firestore.FieldValue.increment(0);
    book.id = id;

    booksCollection.doc(id).set(book);

    return this.db.doc<IBook>(`books/${id}`).valueChanges();
  }

  public async deleteBook(bookId: string): Promise<void> {
    const bookRef: AngularFirestoreDocument<IBook> = this.db.doc<IBook>(
      `books/${bookId}`,
    );
    const path = `books/${bookId}/recommendations`;

    const recommendations: firebase.firestore.QuerySnapshot = await this.db
      .collection(path)
      .ref.get();

    recommendations.forEach(
      (recommendation: firebase.firestore.QueryDocumentSnapshot) => {
        recommendation.ref.delete();
      },
    );

    return bookRef.delete();
  }

  public getAllBooks(userId: string): Observable<IBook[]> {
    const bookRef: AngularFirestoreCollection<IBook> = this.db.collection<
      IBook
    >('books', ref =>
      ref
        .where('uid', '==', userId)
        .orderBy('recommendationCount', 'desc')
        .orderBy('created', 'desc'),
    );

    return bookRef.valueChanges();
  }

  public getAllBooksByDate(userId: string): Observable<IBook[]> {
    const bookRef: AngularFirestoreCollection<IBook> = this.db.collection<
      IBook
    >('books', ref =>
      ref.where('uid', '==', userId).orderBy('created', 'desc'),
    );

    return bookRef.valueChanges();
  }

  public getBookById(bookId: string): Observable<IBook> {
    return this.db.doc<IBook>(`books/${bookId}`).valueChanges();
  }

  // Recommendation Actions
  public addRecommendation(
    bookId: string,
    recommendation: IRecommendation,
  ): Observable<IBook> {
    const recommendationId: string = this.db.createId();
    const bookRef: AngularFirestoreDocument<IBook> = this.db
      .collection('books')
      .doc<IBook>(bookId);

    recommendation.created = firebase.firestore.FieldValue.serverTimestamp();

    bookRef
      .collection('recommendations')
      .doc(recommendationId)
      .set({
        id: recommendationId,
        source: recommendation.source,
        url: recommendation.url,
        uid: recommendation.uid,
        created: recommendation.created,
      });

    bookRef.update({
      recommendationCount: firebase.firestore.FieldValue.increment(1),
    });

    return this.db
      .collection('books')
      .doc<IBook>(bookId)
      .valueChanges();
  }

  public getAllRecommendationsForBook(
    bookId: string,
  ): Observable<IRecommendation[]> {
    return this.db
      .collection('books')
      .doc(bookId)
      .collection<IRecommendation>('recommendations')
      .valueChanges();
  }

  public removeRecommendation(
    bookId: string,
    recommendationId: string,
  ): Observable<IRecommendation[]> {
    const bookRef: AngularFirestoreDocument<IBook> = this.db
      .collection('books')
      .doc(bookId);
    const recommendationsRef: AngularFirestoreCollection<
      IRecommendation
    > = bookRef.collection('recommendations');

    recommendationsRef.doc(recommendationId).delete();

    bookRef.update({
      recommendationCount: firebase.firestore.FieldValue.increment(-1),
    });

    return recommendationsRef.valueChanges();
  }

  public updateRecommendation(
    bookId: string,
    recommendationId: string,
    recommendation: IRecommendation,
  ): Observable<IRecommendation[]> {
    const recommendationsRef: AngularFirestoreCollection<
      IRecommendation
    > = this.db
      .collection('books')
      .doc(bookId)
      .collection('recommendations');

    recommendationsRef.doc(recommendationId).update(recommendation);

    return recommendationsRef.valueChanges();
  }
}
