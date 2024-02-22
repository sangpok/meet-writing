import {
  DocumentData,
  DocumentReference,
  QueryDocumentSnapshot,
  Timestamp,
} from 'firebase/firestore';
import { Post } from './Model';

export type InfiniteResponse<T> = {
  lastViewRef: DocumentReference | null;
  list: T;
};

export type SavedPostDoc = {
  createdAt: Timestamp;
  userId: string;
  postRef: DocumentReference<Post>;
};
