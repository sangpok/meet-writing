/** Asset */
import icons from './sprites.svg';

/** Type */
import type { SVGAttributes } from 'react';

export type IconName =
  | 'logo'
  | 'menu'
  | 'bookmark'
  | 'warning'
  | 'info'
  | 'x'
  | 'chevron-left'
  | 'chevron-up'
  | 'lock-keyhole'
  | 'bookmark-minus'
  | 'bookmark-plus'
  | 'more-vertical'
  | 'alert'
  | 'bookmark'
  | 'circle-user'
  | 'unlock-keyhole'
  | 'book-marked'
  | 'menu'
  | 'open-book-text'
  | 'chevron-right'
  | 'book'
  | 'chevron-down'
  | 'settings'
  | 'pencil_line'
  | 'pencil'
  | 'trash';

import styles from './SVGIcon.module.scss';
import cn from 'classnames';

type SVGIconProp = {
  name: IconName;
  size?: number;
} & SVGAttributes<SVGElement>;

export const SVGIcon = ({ name, size = 32, className }: SVGIconProp) => {
  return (
    <svg className={cn(styles.defaultIcon, className)} fill="none" width={size} height={size}>
      <use href={`${icons}#${name}`} />
    </svg>
  );
};
