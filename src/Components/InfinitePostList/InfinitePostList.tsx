import { useInfiniteObserver } from '@Hooks/useInfiniteObserver';
import { Post } from '@Type/Model';
import { InfiniteResponse } from '@Type/Response';
import { getCurrentPostId, getFormattedDate, getHourLabel, getPostById } from '@Utils/index';
import { InfiniteData, UseSuspenseInfiniteQueryResult } from '@tanstack/react-query';
import { UIEventHandler, useEffect, useRef } from 'react';
import { RotatingLines } from 'react-loader-spinner';
import styles from './InfinitePostList.module.scss';

export const InfinitePostList = ({
  onPostChange,
  ...infiniteQuery
}: {
  onPostChange: (post: Post) => void;
} & UseSuspenseInfiniteQueryResult<InfiniteData<InfiniteResponse<Post[]>, unknown>, Error>) => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = infiniteQuery;
  const { pages } = data;

  const prevScrollTopRef = useRef(0);

  const { disconnect: disconnectObserver } = useInfiniteObserver({
    parentNodeId: 'scrollableBody',
    onIntersection: fetchNextPage,
  });

  useEffect(() => {
    !hasNextPage && disconnectObserver();
  }, [hasNextPage]);

  const handleScroll: UIEventHandler<HTMLDivElement> = (e) => {
    const { scrollTop, offsetHeight } = e.target as HTMLDivElement;
    const prevScrollTop = prevScrollTopRef.current;

    const distance = scrollTop - (prevScrollTop ? prevScrollTop : 0);
    const pxRemain = scrollTop % offsetHeight;
    const newPxRemain = pxRemain === 0 ? 0 : distance > 0 ? offsetHeight - pxRemain : pxRemain;
    const threshold = 500;

    if (newPxRemain < threshold) {
      const targetPostId = getCurrentPostId();
      const targetPost = getPostById(pages, targetPostId);

      if (targetPost === null) {
        throw new Error('never but for targetPost type-gurad');
      }

      onPostChange(targetPost);
    }

    prevScrollTopRef.current = scrollTop;
  };

  return (
    <div
      id="scrollableBody"
      className={styles.scrollableBody}
      onClick={() => {}}
      onScroll={handleScroll}
    >
      {isFetchingNextPage && (
        <div className={styles.topright}>
          <RotatingLines width="1.125rem" strokeColor="black" />
        </div>
      )}
      {pages.map((page) =>
        page.list.map(
          (post) => post.visibility === 'public' && <PostItem key={post.id} {...post} /> // 공개된 포스트 임시 방편... 원래 색인 해야하는데(ㅋㅋ)
        )
      )}
    </div>
  );
};

const PostItem = ({ author, content, createdAt, id, source, username }: Post) => {
  const createdDate = createdAt.toDate();
  const hourLabel = getHourLabel(createdDate.getHours());

  return (
    <div data-pid={id} className={styles.postItem} tabIndex={0}>
      <div className={styles.postContent}>{content}</div>
      <div className={styles.postMetadata}>
        <p>
          / <strong>{author}</strong>의 <strong>{source}</strong>에서
        </p>
        <p>
          {getFormattedDate(createdDate)} {hourLabel}, <strong>{username}</strong> 작성
        </p>
      </div>
    </div>
  );
};
