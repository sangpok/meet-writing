import { PostCard } from '@Components/PostCard';
import { Typography } from '@Components/Typography';
import { useDeletePost, useToggleSavedPost, useUpdatePostVisibility } from '@Hooks/FirestoreHooks';
import { useInfiniteObserver } from '@Hooks/useInfiniteObserver';
import { Post } from '@Type/Model';
import { InfiniteResponse } from '@Type/Response';
import { InfiniteData, UseSuspenseInfiniteQueryResult } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { RotatingLines } from 'react-loader-spinner';
import { useNavigate } from 'react-router-dom';
import styles from './InfinitePostCardList.module.scss';

export const InfinitePostCardList = ({
  type,
  ...infiniteQuery
}: {
  type: 'mypost' | 'savedPost';
} & UseSuspenseInfiniteQueryResult<InfiniteData<InfiniteResponse<Post[]>, unknown>, Error>) => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = infiniteQuery;
  const { pages } = data;

  const { disconnect: disconnectObserver } = useInfiniteObserver({
    parentNodeId: 'postCardList',
    onIntersection: fetchNextPage,
  });

  useEffect(() => {
    !hasNextPage && disconnectObserver();
  }, [hasNextPage]);

  return (
    <ul id="postCardList" className={styles.postList}>
      {pages.map((myposts) =>
        myposts.list.map((mypost) => <PostItem key={mypost.id} {...mypost} type={type} />)
      )}

      {isFetchingNextPage && <FetchingIcon />}
      {!hasNextPage && <LoadedAllPosts type={type} />}
    </ul>
  );
};

const FetchingIcon = () => {
  return (
    <div className={styles.selfCenter}>
      <RotatingLines width="1.125rem" strokeColor="black" />
    </div>
  );
};

const LoadedAllPosts = ({ type }: { type: 'mypost' | 'savedPost' }) => {
  const isMyPostType = type === 'mypost';
  const isSavedPostType = type === 'savedPost';

  return (
    <Typography as="body2" className={styles.grayed}>
      {isMyPostType && '내 게시글을 전부 불러왔어요.'}
      {isSavedPostType && '내 마음에 든 마중글을 전부 불러왔어요.'}
    </Typography>
  );
};

const PostItem = ({ type, ...post }: { type: 'mypost' | 'savedPost' } & Post) => {
  const navigate = useNavigate();

  const [itemState, setItemState] = useState('idle');

  const { mutate: toggleVisiblity } = useUpdatePostVisibility();
  const { mutate: toggleSavedPost } = useToggleSavedPost();
  const { mutate: deletePost } = useDeletePost();

  const handleSelect = (menuType: string) => {
    if (menuType === 'edit') {
      return navigate(`/mypost/edit`, { state: { post: JSON.stringify(post) } });
    }

    if (menuType === 'visibility') {
      setItemState('submitting');

      return toggleVisiblity(
        { ...post },
        {
          onError(error) {
            alert('실패함 ㅜㅜ');
            console.log(error);
          },
          onSettled: () => setItemState('idle'),
        }
      );
    }

    if (menuType === 'save') {
      setItemState('submitting');

      toggleSavedPost(
        { ...post },
        {
          onError(error) {
            alert('실패함 ㅜㅜ');
            console.log(error);
          },
          onSettled: () => setItemState('idle'),
        }
      );
    }

    if (menuType === 'delete') {
      const wouldDelete = confirm('진짜 삭제하게요?');

      if (wouldDelete) {
        setItemState('deleting');

        return deletePost(
          { ...post },
          {
            onError(error) {
              alert('실패함 ㅜㅜ');
              console.log(error);
              setItemState('idle');
            },
          }
        );
      }
    }
  };

  const handleClick = () => {
    navigate(`/${type === 'mypost' ? 'mypost' : 'saved-post'}/view`, {
      state: JSON.stringify({ post }),
      preventScrollReset: true,
    });
  };

  return (
    <PostCard
      {...post}
      type={type}
      state={itemState}
      onSelect={handleSelect}
      onClick={handleClick}
    />
  );
};
