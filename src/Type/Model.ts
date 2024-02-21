import { Timestamp } from 'firebase/firestore';

export type User = {
  createdAt: Timestamp;
  updatedAt: Timestamp;
  email: string;
  username: string;
};

export type Post = {
  id: string;
  postId: number;
  userId: string;
  username: string;
  author: string;
  source: string;
  content: string;
  createdAt: Timestamp;
  updatedAt: string;
  visibility: string;
  isSavedPost: boolean;
};

export type MypostMeta = {
  postsCount: number;
  publicCount: number;
};

export type SavedPostsMeta = {
  savedPostsCount: number;
};

export type UserSettings = {
  baseFontSize: string;
};
