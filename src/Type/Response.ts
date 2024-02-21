import { DocumentReference, Timestamp } from 'firebase/firestore';
import { Post } from './Model';

export type InfiniteResponse<T> = {
  lastViewRef: unknown;
  list: T;
};

export type SavedPostDoc = {
  createdAt: Timestamp;
  userId: string;
  postRef: DocumentReference<Post>;
};
