import { IBook, IRecommendation, IBookPost } from './book.types';
import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument,
  QueryDocumentSnapshot,
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
  public addBook(book: IBookPost): Observable<IBook> {
    const booksCollection = this.db.collection<IBook>('books');

    book.created = firebase.database.ServerValue.TIMESTAMP;

    booksCollection.doc(book.id).set(book);

    return this.db.doc<IBook>(`books/${book.id}`).valueChanges();
  }

  public deleteBook(bookId: string): Observable<void> {
    const bookRef: AngularFirestoreDocument<IBook> = this.db.doc<IBook>(
      `books/${bookId}`,
    );
    const path = `books/${bookId}/recommendations`;

    const deleteFn = firebase
      .functions()
      .httpsCallable('removeRecommendations');

    deleteFn({ path })
      .then(result => console.log('Delete success: ' + JSON.stringify(result)))
      .catch(err => console.error('Delete failed, see console', err));

    return from(this.db.doc<IBook>(`books/${bookId}`).delete());
  }

  public getAllBooks(userId: string): Observable<IBook[]> {
    const bookRef: any = this.db.collection<IBook>('books', ref =>
      ref.where('uid', '==', `${userId}`),
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
    const bookRef: AngularFirestoreDocument<IBookPost> = this.db
      .collection('books')
      .doc<IBookPost>(bookId);

    bookRef
      .collection('recommendations')
      .doc(recommendationId)
      .set({
        id: recommendationId,
        source: recommendation.source,
        url: recommendation.url,
      });

    bookRef.update({
      recommendations: firebase.firestore.FieldValue.increment(1),
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
    const bookRef: AngularFirestoreDocument<IBookPost> = this.db
      .collection('books')
      .doc(bookId);
    const recommendationsRef: AngularFirestoreCollection<
      IRecommendation
    > = bookRef.collection('recommendations');

    recommendationsRef.doc(recommendationId).delete();

    bookRef.update({
      recommendations: firebase.firestore.FieldValue.increment(-1),
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
