export interface IBook {
  id?: string;
  googleId?: string;
  title: string;
  authors: string;
  uid: string;
  thumbnailUrl: string;
  recommendationCount?: any;
  created?: any;
}

export interface IBookPreview {
  googleId: string;
  title: string;
  authors: string[];
  thumbnailUrl: string;
  description: string;
}

export interface IRecommendation {
  id: string;
  source: string;
  url: string;
  uid: string;
  reason: string;
  created: any;
}
