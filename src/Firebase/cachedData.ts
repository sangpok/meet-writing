import { Post, User } from '@Type/Model';

export const cachedPosts = new Map<string, Post>();
export const cachedUsers = new Map<string, User>();
export const cachedSavedPost = new Map<string, Post>();
