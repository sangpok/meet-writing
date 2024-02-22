import { cachedPosts, cachedUsers } from '@Firebase/cachedData';
import { auth, db } from '@Firebase/firebase';
import { MypostMeta, Post, SavedPostsMeta, User } from '@Type/Model';
import { InfiniteResponse, SavedPostDoc } from '@Type/Response';
import { shuffle } from '@Utils/index';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import {
  DocumentReference,
  OrderByDirection,
  Timestamp,
  addDoc,
  and,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  startAfter,
  updateDoc,
  where,
} from 'firebase/firestore';

export const getRandomPosts = async ({
  pageSize = 6,
  randomIndex = 0,
  sortIndex = 0,
  lastViewRef = null,
}: {
  pageSize?: number;
  randomIndex?: number;
  sortIndex?: number;
  lastViewRef: DocumentReference | null;
}) => {
  const randomFields = ['A', 'B', 'C', 'D', 'E'];
  const selectedRandomField = randomFields[randomIndex];

  const sortFields = ['asc', 'desc'];
  const selectedSortField = sortFields[sortIndex] as OrderByDirection;

  const postsRef = collection(db, 'posts');

  const q = lastViewRef
    ? query(
        postsRef,
        // where('visibility', '==', 'public'), // 이거 하면 색인 해야하는데.... 귀찮아진다
        orderBy(`random${selectedRandomField}`, selectedSortField),
        startAfter(lastViewRef),
        limit(pageSize)
      )
    : query(
        postsRef,
        // where('visibility', '==', 'public'), // 이거 하면 색인 해야하는데.... 귀찮아진다
        orderBy(`random${selectedRandomField}`, selectedSortField),
        limit(pageSize)
      );

  const querySnapshot = await getDocs(q);

  const savedPostsRef = collection(db, 'saved_posts');
  const qq = query(savedPostsRef, where('userId', '==', auth.currentUser!.uid));

  const savedPostDocs = await getDocs(qq);

  const savedPostIds = await Promise.all(
    savedPostDocs.docs.map(async (savedPostDoc) => {
      const savedPost = savedPostDoc.data() as SavedPostDoc;

      const hasCachedPost = cachedPosts.has(savedPost.postRef.id);

      if (hasCachedPost) {
        return savedPost.postRef.id;
      }

      const postDoc = await getDoc(savedPost.postRef);
      const postData = postDoc.data()!;

      cachedPosts.set(postDoc.id, postData);

      return postDoc.id;
    })
  );

  return {
    lastViewRef: querySnapshot.docs.at(-1) as unknown as DocumentReference,
    list: await Promise.all(
      shuffle(
        querySnapshot.docs.map(async (doc) => {
          const postData = doc.data() as Post & { userRef?: DocumentReference };
          const userRef = postData.userRef;

          if (userRef === undefined) {
            throw new Error('never but for userRef type-guard');
          }

          const hasCachedUser = cachedUsers.has(userRef.id);

          if (!hasCachedUser) {
            cachedUsers.set(userRef.id, (await getDoc(userRef)).data()! as User);
          }

          const userData = cachedUsers.get(userRef.id)!;
          const postObject: Post & { userRef?: DocumentReference } = {
            ...postData,
            id: doc.id,
            username: userData.username,
            isSavedPost: savedPostIds.includes(doc.id),
          };

          delete postObject.userRef;

          return postObject as Post;
        })
      )
    ),
  } as InfiniteResponse<Post[]>;
};

export type CheckEmailRequest = { email: string };
export const checkEmail = async ({ email }: CheckEmailRequest) => {
  const q = query(collection(db, 'users'), where('email', '==', email));
  const querySnapshot = await getDocs(q);

  return querySnapshot.empty;
};

export type CreateUserRequest = { email: string; password: string };
export const createUser = async ({ email, password }: CreateUserRequest) => {
  const result = await createUserWithEmailAndPassword(auth, email, password);

  const usersRef = collection(db, 'users');

  const timestamp = Timestamp.now();

  await setDoc(doc(usersRef, result.user.uid), {
    username: result.user.displayName,
    email: result.user.email,
    createdAt: timestamp,
    updatedAt: timestamp,
  });

  return true;
};

export type CheckUsernameRequest = { username: string };
export const checkUsername = async ({ username }: CheckUsernameRequest) => {
  const q = query(collection(db, 'users'), where('username', '==', username));
  const querySnapshot = await getDocs(q);

  return querySnapshot.empty;
};

export type UpdateUsernameRequest = { username: string };
export const updateUsername = async ({ username }: UpdateUsernameRequest) => {
  if (auth.currentUser === null) {
    throw new Error('currentUser가 없어용: updateUsername');
  }

  const couldUpdate = await checkUsername({ username });

  if (!couldUpdate) {
    return false;
  }

  const userRef = doc(db, 'users', auth.currentUser.uid);

  await updateProfile(auth.currentUser, { displayName: username });
  await updateDoc(userRef, { username, updatedAt: Timestamp.now() });

  return true;
};

export type CreatePostRequest = {
  author: string;
  source: string;
  visibility: string;
  content: string;
};

export const createPost = async ({ author, content, source, visibility }: CreatePostRequest) => {
  const postsRef = collection(db, 'posts');

  const userRef = doc(collection(db, 'users'), auth.currentUser!.uid);
  const timestamp = serverTimestamp();

  const result = await addDoc(postsRef, {
    postId: (await getDocs(postsRef)).size + 1,
    author,
    source,
    visibility,
    content,
    userRef,
    randomA: Math.floor(Math.random() * 10000),
    randomB: Math.floor(Math.random() * 10000),
    randomC: Math.floor(Math.random() * 10000),
    randomD: Math.floor(Math.random() * 10000),
    randomE: Math.floor(Math.random() * 10000),
    createdAt: timestamp,
    updatedAt: timestamp,
  });

  return true;
};

export const getMyPostMetadata = async () => {
  const postsRef = collection(db, 'posts');
  const userRef = doc(collection(db, 'users'), auth.currentUser!.uid);

  const q = query(postsRef, where('userRef', '==', userRef));

  const myposts = await getDocs(q);
  const postsCount = myposts.size;
  const publicCount = myposts.docs
    .map((mypost) => mypost.get('visibility'))
    .filter((visibility) => visibility === 'public').length;

  return { postsCount, publicCount } as MypostMeta;
};

export const getMyPosts = async ({
  pageSize = 6,
  lastViewRef = null,
}: {
  pageSize?: number;
  lastViewRef: DocumentReference | null;
}) => {
  const postsRef = collection(db, 'posts');
  const userRef = doc(collection(db, 'users'), auth.currentUser!.uid);

  const q = lastViewRef
    ? query(
        postsRef,
        where('userRef', '==', userRef),
        orderBy('createdAt', 'desc'),
        startAfter(lastViewRef),
        limit(pageSize)
      )
    : query(
        postsRef,
        where('userRef', '==', userRef),
        orderBy('createdAt', 'desc'),
        limit(pageSize)
      );

  const mypostDocs = await getDocs(q);

  const savedPostsRef = collection(db, 'saved_posts');
  const qq = query(savedPostsRef, where('userId', '==', auth.currentUser!.uid));

  const savedPostDocs = await getDocs(qq);

  const savedPostIds = await Promise.all(
    savedPostDocs.docs.map(async (savedPostDoc) => {
      const savedPost = savedPostDoc.data() as SavedPostDoc;

      const hasCachedPost = cachedPosts.has(savedPost.postRef.id);

      if (hasCachedPost) {
        return savedPost.postRef.id;
      }

      const postDoc = await getDoc(savedPost.postRef);
      const postData = postDoc.data()!;

      cachedPosts.set(postDoc.id, postData);

      return postDoc.id;
    })
  );

  return {
    lastViewRef: mypostDocs.docs[mypostDocs.size - 1] as unknown as DocumentReference,
    list: mypostDocs.docs.map((mypostDoc) => {
      return {
        id: mypostDoc.id,
        ...mypostDoc.data(),
        username: auth.currentUser!.displayName,
        isSavedPost: savedPostIds.includes(mypostDoc.id),
      } as Post;
    }),
  } as InfiniteResponse<Post[]>;
};

export type ServiceLoginRequest = { email: string; password: string };
export const serviceLogin = async ({ email, password }: ServiceLoginRequest) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);

  const hasNoDisplayName = userCredential.user.displayName === null;

  if (hasNoDisplayName) {
    const userRef = await getDoc(doc(collection(db, 'users'), userCredential.user.uid));
    const userData = userRef.data() as User;

    await updateProfile(auth.currentUser!, { displayName: userData.username });
  }

  return userCredential;
};

export type UpdatePostRequest = {
  id: string;
  author: string;
  source: string;
  visibility: string;
  content: string;
};

export const updatePost = async ({
  id,
  author,
  content,
  source,
  visibility,
}: UpdatePostRequest) => {
  const postRef = doc(collection(db, 'posts'), id);
  const timestamp = Timestamp.now();

  await updateDoc(postRef, {
    author,
    source,
    visibility,
    content,
    // random: Math.floor(Math.random() * 10000),
    updatedAt: timestamp,
  });

  return true;
};

export type UpdatePostVisibilityRequest = { id: string; visibility: string };
export const updatePostVisibility = async ({ id, visibility }: UpdatePostVisibilityRequest) => {
  const postRef = doc(collection(db, 'posts'), id);
  const timestamp = Timestamp.now();

  await updateDoc(postRef, {
    visibility,
    updatedAt: timestamp,
  });

  return true;
};

export const createSavedPost = async ({ postId }: { postId: string }) => {
  const savedPostsRef = collection(db, 'saved_posts');
  const postDocRef = doc(collection(db, 'posts'), postId);

  const timestamp = Timestamp.now();

  await addDoc(savedPostsRef, {
    createdAt: timestamp,
    userId: auth.currentUser!.uid,
    postRef: postDocRef,
  });

  return true;
};

export const deleteSavedPost = async ({ postId }: { postId: string }) => {
  const savedPostsRef = collection(db, 'saved_posts');
  const postRef = doc(collection(db, 'posts'), postId);

  const q = query(
    savedPostsRef,
    and(where('postRef', '==', postRef), where('userId', '==', auth.currentUser!.uid))
  );

  const savedPostsDoc = await getDocs(q);
  const savedPostId = savedPostsDoc.docs[0].id;
  const savedPostDocRef = doc(collection(db, 'saved_posts'), savedPostId);

  await deleteDoc(savedPostDocRef);

  return true;
};

export type ToggleSavedPostRequest = { id: string; isSavedPost: boolean };
export const toggleSavedPost = async ({ id, isSavedPost }: ToggleSavedPostRequest) => {
  const savedPostsRef = collection(db, 'saved_posts');
  const postDocRef = doc(collection(db, 'posts'), id);

  if (isSavedPost) {
    const q = query(
      savedPostsRef,
      and(where('postRef', '==', postDocRef), where('userId', '==', auth.currentUser!.uid))
    );

    const savedPostsDoc = await getDocs(q);
    const savedPostId = savedPostsDoc.docs[0].id;
    const savedPostDocRef = doc(collection(db, 'saved_posts'), savedPostId);

    await deleteDoc(savedPostDocRef);
  } else {
    await addDoc(savedPostsRef, {
      createdAt: Timestamp.now(),
      userId: auth.currentUser!.uid,
      postRef: postDocRef,
    });
  }

  return true;
};

export const getSavedPostMetainfo = async () => {
  const savedPostsRef = collection(db, 'saved_posts');
  const q = query(savedPostsRef, where('userId', '==', auth.currentUser!.uid));
  const savedPosts = await getDocs(q);

  return { savedPostsCount: savedPosts.empty ? 0 : savedPosts.size } as SavedPostsMeta;
};

export const getSavedPosts = async ({
  pageSize = 6,
  lastViewRef = null,
}: {
  pageSize?: number;
  lastViewRef: DocumentReference | null;
}) => {
  const savedPostsRef = collection(db, 'saved_posts');

  const q = lastViewRef
    ? query(
        savedPostsRef,
        where('userId', '==', auth.currentUser!.uid),
        orderBy('createdAt', 'desc'),
        startAfter(lastViewRef),
        limit(pageSize)
      )
    : query(
        savedPostsRef,
        where('userId', '==', auth.currentUser!.uid),
        orderBy('createdAt', 'desc'),
        limit(pageSize)
      );

  const savedPostDocs = await getDocs(q);
  const savedPosts = await Promise.all(
    savedPostDocs.docs.map(async (savedPostDoc) => {
      const savedPost = savedPostDoc.data() as SavedPostDoc;
      const post = await getDoc(savedPost.postRef);

      return { id: post.id, ...post.data(), isSavedPost: true } as Post;
    })
  );

  const infiniteResponse = {
    lastViewRef: savedPostDocs.docs.at(-1) as unknown as DocumentReference,
    list: savedPosts,
  };

  return infiniteResponse;
};

export const deletePost = async ({ id, visibility }: { id: string; visibility: string }) => {
  const postRef = doc(collection(db, 'posts'), id);
  await deleteDoc(postRef);

  // just for unused type-error
  return visibility ? true : true;
};

export const resignService = async () => {
  const userRef = doc(collection(db, 'users'), auth.currentUser!.uid);

  await deleteDoc(userRef);
  await auth.currentUser?.delete();

  return true;
};
