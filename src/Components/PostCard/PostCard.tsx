import { SVGIcon } from '@Icons/SVGIcon';
import { Post } from '@Type/Model';
import { getFormattedDate, getHourLabel } from '@Utils/index';
import cn from 'classnames';
import { MouseEvent } from 'react';
import { RotatingLines } from 'react-loader-spinner';
import styles from './PostCard.module.scss';
import { PostContextMenu } from './PostContextMenu/PostContextMenu';

export const PostCard = ({
  type,
  state,
  onSelect,
  onClick,
  ...post
}: {
  type: 'mypost' | 'savedPost';
  state: string;
  onSelect: (type: string) => void;
  onClick: () => void;
} & Post) => {
  const { author, content, createdAt, postId, source, visibility, isSavedPost } = post;

  const createdDate = createdAt.toDate();
  const formattedDate = getFormattedDate(createdDate);
  const hourLabel = getHourLabel(createdDate.getHours());
  const relativeTimeLabel = `${formattedDate} ${hourLabel}`;

  const isMyPostType = type === 'mypost';
  const isSavedPostType = type === 'savedPost';
  const isPrivate = visibility === 'private';
  const isSubmitting = state === 'submitting';
  const isDeleting = state === 'deleting';
  const isCancelSaving = isSavedPostType && !isSavedPost;

  const isPendingVisible = isSubmitting || isDeleting;
  const isDisabled = isDeleting || isCancelSaving;

  const handleClick = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    onClick();
  };

  return (
    <div role="button" className={styles.rowGroup} onClick={handleClick} aria-disabled={isDisabled}>
      <p className={styles.postNumber}>#{postId}</p>
      <div className={cn(styles.colGroup, styles.flex1, styles.gap12)}>
        <div className={styles.rowGroup}>
          <div className={cn(styles.rowGroup, styles.flex1)}>
            <div className={cn(styles.colGroup, styles.flex1)}>
              <p>
                <strong>{author}</strong>의 <strong>{source}</strong>
                {isPendingVisible && <LoadingSpinner isDisabled={isDisabled} />}
              </p>

              <p className={styles.date}>{relativeTimeLabel}</p>
            </div>

            {isPrivate && <div className={styles.visibilityBadge}>비공개</div>}
          </div>

          {isMyPostType && <PostContextMenu {...post} onSelect={onSelect} />}
          {isSavedPostType && <Bookmark {...post} onClick={() => onSelect('save')} />}
        </div>

        <p className={styles.previewText}>{content}</p>
      </div>
    </div>
  );
};

const LoadingSpinner = ({ isDisabled = false }: { isDisabled?: boolean }) => {
  return (
    <span className={styles.loading}>
      <RotatingLines width="1.125rem" strokeColor={isDisabled ? '#bdbdbd' : 'black'} />
    </span>
  );
};

const Bookmark = ({ isSavedPost, onClick }: { isSavedPost: boolean; onClick: () => void }) => {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    >
      <SVGIcon name="bookmark" className={cn({ [styles.filledBookmark]: isSavedPost })} />
    </button>
  );
};
