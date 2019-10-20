export interface IBook {
  id?: string;
  title: string;
  authors: string;
  uid: string;
  thumbnailUrl: string;
  recommendations: number;
  created?: firebase.firestore.Timestamp;
}

export interface IBookPost {
  id?: string;
  title: string;
  authors: string;
  uid: string;
  thumbnailUrl: string;
  created?: object;
  recommendations?: firebase.firestore.FieldValue;
}

export interface IBookPreview {
  id: string;
  title: string;
  authors: string[];
  thumbnailUrl: string;
  description: string;
}

export interface IRecommendation {
  id: string;
  source: string;
  url: string;
}
