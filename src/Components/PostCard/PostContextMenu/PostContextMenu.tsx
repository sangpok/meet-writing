import { SVGIcon } from '@Icons/SVGIcon';
import { MouseEvent, useState } from 'react';
import styles from './PostContextMenu.module.scss';

type PostContextMenuProp = {
  isSavedPost: boolean;
  visibility: string;
  onSelect: (type: string) => void;
};

export const PostContextMenu = ({ isSavedPost, visibility, onSelect }: PostContextMenuProp) => {
  const [isMenuOpened, setIsMenuOpened] = useState(false);

  const isPublic = visibility === 'public';
  const isPrivate = visibility === 'private';

  const wouldSave = !isSavedPost;
  const wouldUnsave = isSavedPost;

  const handleClick = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setIsMenuOpened(!isMenuOpened);
  };

  return (
    <div role="button" className={styles.contextContainer} onClick={handleClick}>
      <SVGIcon name="more-vertical" />

      {isMenuOpened && (
        <>
          <div className={styles.optionBox}>
            <ul onClick={(e) => e.stopPropagation()}>
              <button onClick={() => onSelect('edit')}>
                <SVGIcon name="pencil_line" className={styles.size18} />
                수정하기
              </button>
              <button
                onClick={() => {
                  setIsMenuOpened(false);
                  onSelect('visibility');
                }}
              >
                <SVGIcon
                  name={isPublic ? 'lock-keyhole' : 'unlock-keyhole'}
                  className={styles.size18}
                />
                {isPublic && '비공개로 돌리기'}
                {isPrivate && '공개로 돌리기'}
              </button>
              <button
                onClick={() => {
                  setIsMenuOpened(false);
                  onSelect('save');
                }}
              >
                <SVGIcon
                  name={isSavedPost ? 'bookmark-minus' : 'bookmark-plus'}
                  className={styles.size18}
                />
                {wouldSave && '저장하기'}
                {wouldUnsave && '저장 취소하기'}
              </button>
              <button
                className={styles.dangerButton}
                onClick={() => {
                  setIsMenuOpened(false);
                  onSelect('delete');
                }}
              >
                <SVGIcon name="trash" className={styles.size18} />
                삭제하기
              </button>
            </ul>
          </div>

          <div className={styles.backgroundOverlay} />
        </>
      )}
    </div>
  );
};
