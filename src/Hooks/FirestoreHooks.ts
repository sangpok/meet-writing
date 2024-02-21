import {
  CreateUserRequest,
  checkEmail,
  checkUsername,
  createPost,
  createUser,
  deletePost,
  getMyPostMetadata,
  getMyPosts,
  getRandomPosts,
  getSavedPostMetainfo,
  getSavedPosts,
  resignService,
  serviceLogin,
  toggleSavedPost,
  updatePost,
  updatePostVisibility,
  updateUsername,
} from '@/API';
import { MypostMeta, Post, SavedPostsMeta } from '@Type/Model';
import { InfiniteResponse } from '@Type/Response';
import {
  InfiniteData,
  useMutation,
  useQueryClient,
  useSuspenseInfiniteQuery,
  useSuspenseQuery,
} from '@tanstack/react-query';
import { AuthError, UserCredential } from 'firebase/auth';
import { DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';
import { produce } from 'immer';

const randomIndex = Math.floor(Math.random() * 5);
const sortIndex = Math.floor(Math.random() * 2);

export const useGetRandomPosts = () => {
  return useSuspenseInfiniteQuery({
    queryKey: ['posts'],
    queryFn: ({ pageParam: lastViewRef }) =>
      getRandomPosts({ lastViewRef, randomIndex, sortIndex }),
    initialPageParam: null as QueryDocumentSnapshot<DocumentData, DocumentData> | null,
    getNextPageParam: (lastPage) => {
      return lastPage.list.length < 6
        ? undefined
        : (lastPage.lastViewRef as QueryDocumentSnapshot<DocumentData, DocumentData>);
    },
  });
};

export const useCheckEmail = () => {
  return useMutation({
    mutationKey: ['checkEmail'],
    mutationFn: checkEmail,
    onError(error) {
      console.log(error);
    },
  });
};

export const useCreateUser = () => {
  return useMutation<boolean, AuthError, CreateUserRequest>({
    mutationKey: ['createUser'],
    mutationFn: createUser,
  });
};

export const useCheckUsername = () => {
  return useMutation({
    mutationKey: ['checkUsername'],
    mutationFn: checkUsername,
  });
};

export const useUpdateUsername = () => {
  return useMutation({
    mutationKey: ['updateUsername'],
    mutationFn: updateUsername,
  });
};

export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['createPost'],
    mutationFn: createPost,
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ['posts', 'mypost'] });
      queryClient.invalidateQueries({ queryKey: ['my'] });
    },
  });
};

export const useUpdatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['updatePost'],
    mutationFn: updatePost,
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ['posts', 'mypost'] });
      queryClient.invalidateQueries({ queryKey: ['my'] });
    },
  });
};

export const useGetMyPosts = () => {
  return useSuspenseInfiniteQuery({
    queryKey: ['posts', 'mypost'],
    queryFn: ({ pageParam }) => getMyPosts({ lastViewRef: pageParam }),
    initialPageParam: null as QueryDocumentSnapshot<DocumentData, DocumentData> | null,
    getNextPageParam: (lastPage) => {
      return lastPage.list.length < 6
        ? undefined
        : (lastPage.lastViewRef as QueryDocumentSnapshot<DocumentData, DocumentData>);
    },
  });
};

export const useGetMyPostMetadata = () => {
  return useSuspenseQuery({
    queryKey: ['my'],
    queryFn: getMyPostMetadata,
  });
};

export const useServiceLogin = () => {
  return useMutation<UserCredential, AuthError, { email: string; password: string }>({
    mutationKey: ['serviceLogin'],
    mutationFn: serviceLogin,
  });
};

export const useUpdatePostVisibility = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['updatePostVisibility'],
    mutationFn: updatePostVisibility,
    async onMutate({ id, visibility }) {
      await queryClient.cancelQueries({ queryKey: ['posts', 'mypost'] });
      await queryClient.cancelQueries({ queryKey: ['my'] });

      const myposts = queryClient.getQueryData<InfiniteData<InfiniteResponse<Post[]>>>([
        'posts',
        'mypost',
      ])!;

      const newVisibility = visibility === 'public' ? 'private' : 'public';

      const newMyposts = produce(myposts, (draft) =>
        draft.pages.forEach((page) => {
          page.list.forEach((post) => {
            if (post.id !== id) {
              return;
            }

            post.visibility = newVisibility;
          });
        })
      );

      queryClient.setQueryData(['posts', 'mypost'], newMyposts);

      const myMetainfo = queryClient.getQueryData(['my']) as MypostMeta;

      queryClient.setQueryData(['my'], {
        ...myMetainfo,
        publicCount:
          newVisibility === 'public' ? myMetainfo.publicCount + 1 : myMetainfo.publicCount - 1,
      });

      return { prevPosts: myposts, prevMeta: myMetainfo };
    },
    onError(_error, _variables, context) {
      // roll back
      queryClient.setQueryData(['posts', 'mypost'], context?.prevPosts);
      queryClient.setQueryData(['my'], context?.prevMeta);
    },
  });
};

export const useDeletePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['deletePost'],
    mutationFn: deletePost,
    async onSuccess(_data, { id, visibility }) {
      await queryClient.cancelQueries({ queryKey: ['posts', 'mypost'] });

      const myposts = queryClient.getQueryData<InfiniteData<InfiniteResponse<Post[]>>>([
        'posts',
        'mypost',
      ])!;

      const newMyposts = produce(myposts, (draft) =>
        draft.pages.forEach((page) => {
          page.list = page.list.filter(({ id: targetId }) => targetId !== id);
        })
      );

      queryClient.setQueryData(['posts', 'mypost'], newMyposts);

      const myPostMeta = queryClient.getQueryData<MypostMeta>(['my'])!;
      const newMypostMeta = produce(myPostMeta, (draft) => {
        draft.postsCount--;
        draft.publicCount = visibility === 'public' ? draft.publicCount - 1 : draft.publicCount;
      });

      queryClient.setQueryData(['my'], newMypostMeta);
      // queryClient.invalidateQueries({ queryKey: ['my'] });
    },
  });
};

export const useGetSavedPostsMetainfo = () => {
  return useSuspenseQuery({
    queryKey: ['savedPosts', 'metainfo'],
    queryFn: getSavedPostMetainfo,
  });
};

export const useGetSavedPosts = () => {
  return useSuspenseInfiniteQuery({
    queryKey: ['savedPosts'],
    queryFn: ({ pageParam: lastViewRef }) => getSavedPosts({ lastViewRef }),
    initialPageParam: null as QueryDocumentSnapshot<DocumentData, DocumentData> | null,
    getNextPageParam(lastPage) {
      return lastPage.list.length < 6 ? undefined : lastPage.lastViewRef;
    },
  });
};

export const useResignService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['resignService'],
    mutationFn: resignService,
    onSuccess() {
      queryClient.clear();
      queryClient.unmount();
    },
  });
};

export const useToggleSavedPost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['toggleSavedPost'],
    mutationFn: toggleSavedPost,
    async onMutate({ id, isSavedPost }) {
      // 모두의 마중글, 내 글, 저장한 글 optimistic update
      await queryClient.cancelQueries({ queryKey: ['posts'] });
      await queryClient.cancelQueries({ queryKey: ['posts', 'mypost'] });
      await queryClient.cancelQueries({ queryKey: ['savedPosts'] });
      await queryClient.cancelQueries({ queryKey: ['savedPosts', 'metainfo'] });

      // 모두의 마중글
      const allPosts = queryClient.getQueryData<InfiniteData<InfiniteResponse<Post[]>>>(['posts']);

      if (allPosts !== undefined) {
        const newAllPosts = produce(allPosts, (draft) =>
          draft.pages.forEach((page) => {
            page.list.forEach((post) => {
              if (post.id !== id) {
                return;
              }

              post.isSavedPost = !post.isSavedPost;
            });
          })
        );

        queryClient.setQueryData(['posts'], newAllPosts);
      }

      // 내 글
      const myPosts = queryClient.getQueryData<InfiniteData<InfiniteResponse<Post[]>>>([
        'posts',
        'mypost',
      ]);

      if (myPosts !== undefined) {
        const newMyPosts = produce(myPosts, (draft) =>
          draft.pages.forEach((page) => {
            page.list.forEach((post) => {
              if (post.id !== id) {
                return;
              }

              post.isSavedPost = !post.isSavedPost;
            });
          })
        );

        queryClient.setQueryData(['posts', 'mypost'], newMyPosts);
      }

      // 저장한 글
      const savedPosts = queryClient.getQueryData<InfiniteData<InfiniteResponse<Post[]>>>([
        'savedPosts',
      ]);

      if (savedPosts !== undefined) {
        const newSavedPosts = produce(savedPosts, (draft) =>
          draft.pages.forEach((page) => {
            page.list.forEach((post) => {
              if (post.id !== id) {
                return;
              }

              post.isSavedPost = !post.isSavedPost;
            });
          })
        );

        queryClient.setQueryData(['savedPosts'], newSavedPosts);
      }

      // 저장한 글 메타
      const savedPostsMetaInfo = queryClient.getQueryData<SavedPostsMeta>([
        'savedPosts',
        'metainfo',
      ]);

      if (savedPostsMetaInfo !== undefined) {
        const newMetainfo = produce(savedPostsMetaInfo, (draft) => {
          if (isSavedPost) {
            draft.savedPostsCount--;
          } else {
            draft.savedPostsCount++;
          }
        });

        queryClient.setQueryData(['savedPosts', 'metainfo'], newMetainfo);
      }

      return {
        prevAllPosts: allPosts,
        prevMyPosts: myPosts,
        prevSavedPosts: savedPosts,
        prevSavedPostsMeta: savedPostsMetaInfo,
      };
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ['posts'], type: 'inactive' });
      queryClient.invalidateQueries({ queryKey: ['savedPosts'], type: 'inactive' });
    },
    onError(_error, _variables, context) {
      queryClient.setQueryData(['posts'], context?.prevAllPosts);
      queryClient.setQueryData(['posts', 'mypost'], context?.prevMyPosts);
      queryClient.setQueryData(['savedPosts'], context?.prevSavedPosts);
      queryClient.setQueryData(['savedPosts', 'metainfo'], context?.prevSavedPostsMeta);
    },
  });
};
