import { SVGIcon } from '@Icons/SVGIcon';
import cn from 'classnames';
import styles from './ToggleSaveButton.module.scss';

export const ToggleSaveButton = ({
  postId,
  isSavedPost = false,
}: {
  postId?: number;
  isSavedPost?: boolean;
}) => {
  return (
    <div className={styles.toggleButton}>
      <span>#{postId || '-'}</span>
      <SVGIcon name="bookmark" className={cn({ [styles.filledBookmark]: isSavedPost })} />
    </div>
  );
};
